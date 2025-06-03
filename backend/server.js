const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const moment = require('moment');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    host: '',
    user: '',
    password: '',
    database: ''
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(connection => {
        console.log('Conexão ao banco de dados MariaDB/MySQL estabelecida com sucesso via Pool!');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

app.get('/api/agendamentos', async (req, res) => {
    const { data, profissional } = req.query; 

    try {
        let query = `
            SELECT 
                A.id, 
                A.data_agendamento, 
                A.horario_agendamento, 
                A.profissional, 
                A.servico_id, 
                A.cliente_id,
                C.nome AS nomeCliente,
                C.telefone AS telefoneCliente
            FROM 
                Agendamentos A
            JOIN 
                Clientes C ON A.cliente_id = C.id
            WHERE 1=1
        `;
        const params = [];

        if (data) {
            query += ' AND A.data_agendamento = ?';
            params.push(data);
        }
        if (profissional) {
            query += ' AND A.profissional = ?'; 
            params.push(profissional);
        }

        query += ' ORDER BY A.data_agendamento ASC, A.horario_agendamento ASC';

        const [results] = await pool.query(query, params);
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
});


app.get('/api/profissionais', async (req, res) => {
    try {
        const [profissionais] = await pool.query('SELECT DISTINCT profissional FROM Agendamentos');
        res.json(profissionais.map(p => p.profissional));
    } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
        res.status(500).json({ error: 'Erro ao buscar profissionais' });
    }
});


const servicosDuracao = require('../frontend/src/pages/servicoshome.json').reduce((acc, servico) => {
    const tempoString = servico.tempo || '0min';
    const duracaoEmMinutos = parseInt(tempoString.replace(/[^0-9]/g, '')) || 0;
    acc[servico.id] = duracaoEmMinutos;
    return acc;
}, {});

app.get('/api/horarios-disponiveis/:data', async (req, res) => {
    const { data } = req.params;
    const profissional = req.query.profissional;
    const servicoId = req.query.servicoId;

    try {
        let query = 'SELECT horario_agendamento, servico_id FROM Agendamentos WHERE data_agendamento = ?';
        const params = [data];
        if (profissional) {
            query += ' AND profissional = ?';
            params.push(profissional);
        }
        const [agendamentos] = await pool.query(query, params);

        const horariosOcupados = new Set();
        agendamentos.forEach(agendamento => {
            const inicioAgendamento = moment(agendamento.horario_agendamento, 'HH:mm');
            const duracao = parseInt(servicosDuracao[agendamento.servico_id]) || 0;
            const fimAgendamento = inicioAgendamento.clone().add(duracao, 'minutes');

            let slotCursor = inicioAgendamento.clone();
            while (slotCursor.isBefore(fimAgendamento)) {
                horariosOcupados.add(slotCursor.format('HH:mm'));
                slotCursor.add(10, 'minutes');
            }
        });

        const horariosPotenciais = [];
        let hora = moment('10:00', 'HH:mm');
        const fimDia = moment('20:00', 'HH:mm');
        while (hora.isSameOrBefore(fimDia)) {
            horariosPotenciais.push(hora.format('HH:mm'));
            hora.add(10, 'minutes');
        }

        const duracaoServicoAtual = parseInt(servicosDuracao[servicoId]) || 0;

        const horariosDisponiveis = horariosPotenciais.filter(slotHora => {
            const inicioDoSlot = moment(slotHora, 'HH:mm');
            const fimPotencialAgendamento = inicioDoSlot.clone().add(duracaoServicoAtual, 'minutes');

            if (horariosOcupados.has(slotHora)) {
                return false;
            }

            if (fimPotencialAgendamento.isAfter(fimDia)) {
                return false;
            }

            let checkCursor = inicioDoSlot.clone().add(10, 'minutes');
            while (checkCursor.isBefore(fimPotencialAgendamento)) {
                if (horariosOcupados.has(checkCursor.format('HH:mm'))) {
                    return false;
                }
                checkCursor.add(10, 'minutes');
            }

            return true;
        });

        console.log('--- Depuração de Horários Disponíveis ---');
        console.log('Data:', data, 'Profissional:', profissional, 'Serviço ID:', servicoId);
        console.log('Agendamentos existentes (do DB):', agendamentos);
        console.log('Horários Ocupados (calculados):', Array.from(horariosOcupados));
        console.log('Horários Potenciais (gerados):', horariosPotenciais);
        console.log('Duração do serviço atual:', duracaoServicoAtual, 'minutos');
        console.log('Horários Disponíveis Finais:', horariosDisponiveis);
        console.log('---------------------------------------');

        res.json(horariosDisponiveis);

    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
    }
});

app.post('/api/agendar', async (req, res) => {
    const {
        nomeCliente,
        telefoneCliente,
        dataAgendamento,
        horaAgendamento,
        profissional,
        servicoId
    } = req.body;

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        let clienteId;

        const [existingClients] = await connection.execute(
            'SELECT id FROM Clientes WHERE telefone = ?',
            [telefoneCliente]
        );

        if (existingClients.length > 0) {
            clienteId = existingClients[0].id;
            console.log(`Cliente existente encontrado: ID ${clienteId}`);
        } else {
            const [newClientResult] = await connection.execute(
                'INSERT INTO Clientes (nome, telefone) VALUES (?, ?)',
                [nomeCliente, telefoneCliente]
            );
            clienteId = newClientResult.insertId;
            console.log(`Novo cliente criado: ID ${clienteId}`);
        }

        const [agendamentoResult] = await connection.execute(
            'INSERT INTO Agendamentos (data_agendamento, horario_agendamento, profissional, servico_id, cliente_id) VALUES (?, ?, ?, ?, ?)',
            [dataAgendamento, horaAgendamento, profissional, servicoId, clienteId]
        );

        await connection.commit();
        console.log('Agendamento e cliente processados com sucesso!');
        res.status(201).json({
            message: 'Agendamento criado com sucesso!',
            agendamentoId: agendamentoResult.insertId,
            clienteId: clienteId
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Erro ao processar agendamento:', error);
        res.status(500).json({ error: 'Erro interno ao criar agendamento.', details: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.get('/api/agendamentos/cliente/:telefone', async (req, res) => {
    const { telefone } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        const [clientRows] = await connection.execute(
            'SELECT id FROM Clientes WHERE telefone = ?',
            [telefone]
        );

        if (clientRows.length === 0) {
            return res.json([]);
        }

        const clienteId = clientRows[0].id;

        const [agendamentos] = await connection.execute(
            'SELECT id, data_agendamento, horario_agendamento, profissional, servico_id FROM Agendamentos WHERE cliente_id = ? ORDER BY data_agendamento ASC, horario_agendamento ASC',
            [clienteId]
        );

        res.json(agendamentos);

    } catch (error) {
        console.error('Erro ao buscar agendamentos do cliente:', error);
        res.status(500).json({ error: 'Erro interno ao buscar agendamentos.' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.delete('/api/agendamentos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute(
            'DELETE FROM Agendamentos WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado.' });
        }

        res.status(200).json({ message: 'Agendamento cancelado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        res.status(500).json({ error: 'Erro interno ao cancelar agendamento.', details: error.message });
    }
});

app.post('/api/admin-login', async (req, res) => {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
        return res.status(400).json({ success: false, message: 'Nome de usuário e senha são obrigatórios.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [adminRows] = await connection.execute(
            'SELECT id, nome FROM Admins WHERE nome = ? AND senha = ?',
            [nome, senha]
        );

        if (adminRows.length > 0) {
            res.status(200).json({ success: true, message: 'Login de administrador bem-sucedido.' });
        } else {
            res.status(401).json({ success: false, message: 'Nome de usuário ou senha inválidos.' });
        }
    } catch (error) {
        console.error('Erro no login de administrador:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
