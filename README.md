# API TimeSupport

TimeSupport foi pensado para ser um hub de ferramentas que auxilie em processos relacionados ao ponto, como ajuste de informações faltantes, conferências de dados dos arquivos, e até geração de arquivos de teste com dados fictícios.

TimeSupport was designed to be a hub of tools that assist in processes related to timekeeping, such as adjusting missing information, checking file data, and even generating test files with fictitious data.

## Funcionalidades / Features

### AFD

O AFD é um arquivo fiscal para registro eletrônico de ponto, criado para padronizar os arquivos para fiscalização do Ministério do Trabalho e homologação padrão de equipamentos.

AFD is a fiscal file for electronic timekeeping, created to standardize files for inspection by the Ministry of Labor and standard equipment approval.

### Geração de Arquivos AFD / AFD File Generation

- **Download 671**: Gera um arquivo AFD no formato 671.
- **Download 1510**: Gera um arquivo AFD no formato 1510.

- **Download 671**: Generates an AFD file in the 671 format.
- **Download 1510**: Generates an AFD file in the 1510 format.

### Cálculo de CRC16 / CRC16 Calculation

- **Upload de Arquivo**: Calcula o CRC16 para cada linha de um arquivo enviado e retorna o arquivo ajustado.

- **File Upload**: Calculates the CRC16 for each line of an uploaded file and returns the adjusted file.

### Status do Servidor / Server Status

- **Wokeup**: Verifica o status do servidor.

- **Wokeup**: Checks the server status.

## Como rodar a aplicação / How to run the application

Usado o ExpressJS para rodar o servidor.

Using ExpressJS to run the server.

```sh
npm i
npm start
```

# Servidor

## O backend em node está sendo rodado pelo Render

Endpoint
[https://afd-generator.onrender.com](https://afd-generator.onrender.com)

## Banco de dados está hospedado pelo mongoDBAltas na AWS

ConnectionString
`mongodb+srv://${dbUser}:${dbPassword}@cluster0.hos1qwb.mongodb.net/AFD-Generate`

# Referências

[Portaria 671/21 MTP](https://in.gov.br/en/web/dou/-/portaria-359094139)
