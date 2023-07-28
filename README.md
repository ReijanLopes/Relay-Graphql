Nota: É importante destacar que as rotas específicas do "User" não serão totalmente utilizadas, mas estarão disponíveis como exemplos.

Nota 2: Tipos do GraphQL podem conter informações desnecessárias usadas como exemplos ou para documentação.

Nota 3: Eu nunca fiz uma rota de pagamento, nem sei como deve ser feito, por isso essa rota e mais como um exemplo

Nota 4: Não consigo entender, o model "Tax", foi bem feito e funcionava, agora ele esta dando um bug que esta refletindo no frontend, não consigo resposta da query. Pelo que parece foi um erro de importação

Nota 5: O cashback padrão será de 1% e a taxa será de 32,788%

Para iniciar o projeto e necessario que um servidor Redis esteja ativo, por minha vez eu indico o [docker](https://www.docker.com/) para isso.

Iniciar servidor Redis:

```bash
 docker run -d -p 6379:6379 --name redis_container redis
```

Para iniciar o backend:

1 - Alterar o env do MONGODB_CONNECT, para sua URL de conexão do mongodb
2 - Verifique se a porta 4005 está livre ou altere o env PORT
3 - Se você seguiu o exemplo a cima não e necessario alterar o env, mas se não baixou o docker e criou a rota na porta expecifica do exemplo e necessario alterar o env da porta REDIS_PORT, e o REDISHOST

Para iniciar o servidor:

```bash
 cd backend && npm start
 or
 cd backend && yarn start
```

Para iniciar o frontend e necessario que o servidor backend esteja ativo.

```bash
npm run ios-relay
npm run android-relay
or
yarn ios-relay
yarn android-relay
```

Se você quer testar o Qrcode vc precisa alterar o env do appID (APP_ID), adicionando o id o woovi

Para um teste rapido eu instalei o "concurrently", nele os comandos para ativar o backend e o frontend se tornam desnecessarios, mas ainda e necessario o servidor Redis
Para ativar tudo de uma vez, vá na root e faça o comando:

```bash
npm run ios
npm run android
or
yarn ios
yarn android
```
