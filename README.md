<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Descrição

Este projeto tem como finalidade fornecer uma solução para um problema de normalização de dados. A API possui um endpoint ``/orders/upload`` que recebe um arquivo *.txt* que transforma os dados para uma estrutura desejada e legível, e salva em um banco de dados *postgresql*, e um endpoint ``/orders/list`` que lista os registros do banco.

## Estruturas de entrada e saída
- ### Arquivo de entrada

	O arquivo de entrada pode possuir várias linhas que seguem o seguinte formato: ``0000000070                              Palmer Prosacco00000007530000000003     1836.7420210308``. A partir desse formato deve-se extrair as seguintes informações: **user_id**, **name**, **order_id**, **product_id**, **value** e **date**, esses dados são salvos no banco de dados e então transformados para a estrutura de saída

- ## Dados de saída
	```json
		[
			{
				"user_id": 1,
				"name": "Zarelli",
				"orders": [
					{
						"order_id": 123,
						"total": "1024.48",
						"date": "2021-12-01",
						"products": [
							{
								"product_id": 111,
								"value": "512.24"
							},
							{
								"product_id": 122,
								"value": "512.24"
							}
						]
					}
				]
			},
		]
	```

- ## Dados salvos no banco
	Os dados salvos no banco seguem a estrutura de cada linha do arquivo de entrada

	```json
		{
			id: '000cf75e-70ea-40bb-b3a8-d2c522331fd6',
			user_id: 99,
			name: 'Junita Jast',
			order_id: 1061,
			product_id: 3,
			value: '1930.69',
			date: '2021-08-18',
			createdAt: new Date('2024-04-17T03:58:27.833Z'),
			updatedAt: new Date('2024-04-17T03:58:27.833Z'),
		},
	```

## Documentação

A documentação com os endpoints existentes pode ser acessada em `/api/docs` na porta `8080`

## Executando

Com o docker rodando basta utilizar e acessar na porta `8080`
```bash
$ docker compose up
```

## Github Workflows

Após um novo commit na branch `main` o github workflows executa o arquivo de pipeline e ao fim é gerada uma nova imagem docker do projeto e enviada para o **Dockerhub**.
