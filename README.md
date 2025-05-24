# Sistema de agendamento para barbearias - Projeto Integrador I - UNIVESP

O presente trabalho apresenta o desenvolvimento de um sistema web de agendamento para barbearias, focado em pequenas empresas que necessitam de uma solução acessível e intuitiva para gerenciar seus atendimentos. Pequenos estabelecimentos frequentemente enfrentam desafios na organização de horários e no controle de clientes, o que pode impactar negativamente a experiência do consumidor e a eficiência do serviço. O principal objetivo do projeto é fornecer uma ferramenta de rápida utilização e baixo custo, permitindo que barbeiros e clientes realizem agendamentos de forma rápida e eficiente. Para isso, foi criada uma interface de fácil entendimento, desenvolvida e testada pelos integrantes do grupo. Estima-se que o sistema desenvolvido seja uma solução eficaz para pequenas barbearias, proporcionando uma alternativa acessível e organizada para a gestão de horários. Futuramente, pretende-se expandir suas funcionalidades, incluindo um painel administrativo mais completo. 

## Gerenciamento do Projeto
O gerenciamento começou a usar um método ágil (Scrum + Kanban) onde os sprints se concentraram em entregas parciais com validação dos usuários. O Trello ajudou a acompanhar as tarefas técnicas (e.g., modelagem de banco de dados) e de design (Figma), e o GitHub também se entrelaçou no fluxo para manter o código rastreável. Isso foi para garantir 
ajustes conforme as mudanças e prazos.

## Design Thinking: 
Em relação ao uso de tecnologias e metodologias, para dar condução e sentido ao projeto fez se uso da abordagem do Desing Thinking (já mencionada inicialmente), onde foi construído 
mapas de empatia para entender cada persona, por fundamentações de papéis (cliente e proprietário), assim como após o entendimento das personas, o mapa de jornada onde foi possível entender o processo desde a fase da trajetória do cliente até a fase da contemplação, elencando alguns pensamentos que poderiam surgir ao longo das etapas, sendo mapeado também do lado do prestador de serviço seguindo as mesmas fases (trajetória e contemplação).  O projeto utilizou-se de mapa conceitual, e de forma altamente colaborativa e com muita 
sinergia validou ideias e descartou outras, atendo-se ao cumprimento de prazos e capacidade técnica, sem perder a essência de pensar em uma entrega simples mas funcional.  
Ainda sobre a abordagem Design Thinking, construiu-se também o caso de uso, facilitando entendimento entre os stakeholders na criação de diagramas de UML, assim como para 
criação do documento de requisitos.

## Especificação de Requisitos de Software (SRS):
Esta fase do projeto resultou na criação da Especificação de Requisitos de Software (SRS), uma documentação técnica fundamental que serviu para alinhar funcionalidades do sistema, regras de negócio e expectativas. 
A estrutura do SRS utilizou a abordagem de Design Thinking utlizando-se da ferramenta do LucidChart conforme especificado abaixo: 
- Mapas conceituais para análise das necessidades dos usuários (clientes e barbeiros).
- Reuniões de alinhamento para alinhar requisitos funcionais e não funcionais.
  
Simultaneamente, a prototipagem em Figma foi iniciada para que pudéssemos validar visualmente esses conceitos antes de partir para o desenvolvimento. O SRS serviu como base 
para: 
1. Regras organizacionais: Diretrizes claras (por exemplo, um agendamento cancelado deve 
liberar o horário na agenda). 
2. Especificação técnica: Um guia para as equipes de front-end (UI) e back-end (API e banco 
de dados). 
3. Comunicação com stakeholders: Um documento para clientes, desenvolvedores e gestores.

## Figma

O Figma foi escolhido como a ferramenta principal para o design da interface do sistema (UI/UX) porque equilibra bem acessibilidade, colaboração em tempo real e trabalho iterativo. 
Além de sua ampla adoção no mercado (o que ajuda na busca de recursos de aprendizado, como tutoriais e bibliotecas de componentes), sua curva de aprendizado é menor para usuários de ferramentas de design 3D, como o Blender, pois existem comandos familiares de manipulação de objetos (por exemplo, atalhos para seleção, transformação e organização de camadas).  
O Figma foi uma mudança de jogo para obter validações rápidas de designs em um sprint, o que significou, no final, menos retrabalho necessário no código. Com uma interface amigável, 
mesmo não-designers na equipe puderam participar do processo de revisão, assegurando a retenção das especificações do cliente.  

## Maria.DB (Banco De Dados) 
O banco de dados da barbearia é estruturado em três tabelas: cliente, agendamentos e admins. Isso se resume em: clientes podem fazer múltiplos agendamentos, a tabela de agendamentos detalha data, hora, profissional etc. E por fim, o admin garante a consistência dos dados nas operações.  

## Linguagens de Programação: Node.JS e REACT 
Para o backend escolhemos a linguagem de programação Node.Js, funciona melhor para aplicativos que exigem simultaneidade (vários cronogramas simultâneos). 
- Flexibilidade: Você pode integrar facilmente com diferentes bancos de dados (Sequelize ou Knex) e APIs REST;
- Ecossistema: O NPM possui muitos pacotes pré-construídos para a maioria dos usos (autenticação, registro, etc.).

Para o Frontend, escolhermos a linguagem de programação React, devído a fatores como: Componentização; Isolamento de funcionalidades (por exemplo, formulário de agendamento, perfil de cliente), simplificando a manutenção. 
- Responsividade: Frameworks como Bootstrap ou Material-UI aceleram a criação de designs responsivos. 
- Estado da Arte: Compatível com as necessidades modernas de UX (por exemplo, renderização rápida, SPAs). 

## GitHub: 
O GitHub foi escolhido por seu ecossistema robusto, que suportou a metodologia ágil adotada. Seus recursos de branching e integração com o Trello garantiram rastreabilidade desde a prototipagem (Figma) até a implementação final, assegurando alinhamento com os requisitos documentados no SRS.



### PALAVRAS-CHAVE: Sistema Web; Agendamento; Gerenciamento; Banco de Dados;
