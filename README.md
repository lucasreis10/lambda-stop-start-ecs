# lambda-start-stop-ecs

<p>O projeto consiste em um AWS Lambda que é acionado por meio do AWS EventBridge em horários pré-determinados. Esse Lambda é capaz de interromper e iniciar tarefas do Amazon ECS (Elastic Container Service) com base no evento recebido.</p>

<p>O AWS EventBridge é responsável por agendar a execução do Lambda em horários específicos. Ao acionar o Lambda, ele verifica o evento recebido para determinar se deve parar ou iniciar tarefas no ECS.</p>

## Estrutura do projeto

<p>O projeto é composto por duas pastas principais: "lambda" e "node-app".</p>

<p>Na pasta "lambda", encontra-se o código do AWS Lambda responsável pelo gerenciamento do cluster ECS (Elastic Container Service). Esse Lambda é responsável por receber eventos e executar ações específicas no cluster ECS, como parar ou iniciar tarefas.</p>

<p>Já na pasta "node-app", está uma aplicação de exemplo em Node.js que simula uma aplicação real necessária para realizar os testes. Essa aplicação pode incluir funcionalidades específicas para o cenário em que o projeto é aplicado.</p>


## Pre requisitos para deploy do lambda

É necessario instalar as seguintes ferramentas para realizar deploy:

* [Serverless](https://www.serverless.com/framework/docs/getting-started)
* [AWS CLI](https://docs.aws.amazon.com/pt_br/cli/latest/userguide/getting-started-install.html) - Necessário para fazer deploy



## Comandos

## Deploy

```bash
# certifique-se de estar no diretório "lambda" antes de executar o comando.
$ cd lambda

# realizar deploy
$ sls deploy
```

## Eventos

### Stop

```json
{
  "action": "stop",
  "region": "us-east-1",
  "clusterName": "cluster"
}
```

### Start
```json
{
  "action": "start",
  "region": "us-east-1",
  "clusterName": "cluster",
  "desiredCount": 2
}
```
O parametro "desiredCount" é necessario para subir a quantidade desejada de tasks ECS.
