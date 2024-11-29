const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Habilita CORS para todas as origens
app.use(cors());

// Configura o express para lidar com JSON com um limite maior
app.use(express.json({ limit: '10mb' }));

// Função para gerar um timestamp formatado
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Endpoint para salvar a imagem
app.post('/upload', (req, res) => {
    const dataURL = req.body.image;
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');

    // Gera um nome de arquivo único com data e hora
    const timestamp = formatDate(new Date());
    const filePath = path.join(__dirname, 'fotos', `foto-${timestamp}.png`);

    // Salva o arquivo na pasta 'fotos'
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Erro ao salvar a imagem:', err);
            return res.status(500).json({ message: 'Erro ao salvar a foto.' });
        }
        res.status(200).json({ message: 'Foto salva com sucesso!', path: filePath });
    });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
