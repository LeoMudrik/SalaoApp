const express = require("express");
const cors = require("cors");

const pool = require("./database");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.get("/profissionais", (req, res) => {
  res.json([
    {
      id: 1,
      nome: "Carlos Barber",
      descricao: "Especialista em degradê",
      foto:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033",
    },
    {
      id: 2,
      nome: "Ana Beauty",
      descricao: "Especialista em unhas",
      foto:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
    },
  ]);
});

app.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, telefone, senha } =
      req.body;

    await pool.query(
      `
      INSERT INTO usuarios
      (nome, email, telefone, senha)

      VALUES
      ($1, $2, $3, $4)
      `,
      [nome, email, telefone, senha]
    );

    res.json({
      mensagem: "Usuário cadastrado com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro ao cadastrar",
    });
  }
});

app.get("/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT NOW()"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await pool.query(
      `
      SELECT * FROM usuarios
      WHERE email = $1
      AND senha = $2
      `,
      [email, senha]
    );

    if (usuario.rows.length === 0) {
      return res.status(401).json({
        erro: "Email ou senha inválidos",
      });
    }

    res.json({
      mensagem: "Login realizado!",
      usuario: usuario.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro no login",
    });
  }
});

app.post("/agendamento", async (req, res) => {
  try {
    const {
      cliente_nome,
      profissional,
      servico,
      data_agendamento,
      horario,
    } = req.body;

    await pool.query(
      `
      INSERT INTO agendamentos
      (
        cliente_nome,
        profissional,
        servico,
        data_agendamento,
        horario
      )

      VALUES
      ($1, $2, $3, $4, $5)
      `,
      [
        cliente_nome,
        profissional,
        servico,
        data_agendamento,
        horario,
      ]
    );

    res.json({
      mensagem: "Agendamento realizado!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro ao agendar",
    });
  }
});


app.get("/agendamentos", async (req, res) => {
  try {
    const resultado = await pool.query(
      `
      SELECT * FROM agendamentos
      `
    );

    res.json(resultado.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro ao buscar agendamentos",
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});