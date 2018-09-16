module.exports = function(app) {
  app.get("/pagamentos", function(req, res) {
    console.log("Requisição de teste");
    res.send("OK");
  });

  app.post("/pagamentos/pagamento", function(req, res) {
    req
      .assert("forma_de_pagamento", "Forma de pagamento é obrigatória")
      .notEmpty();
    req
      .assert("valor", "O Valor é obrigatório e deve ser decimal")
      .notEmpty()
      .isFloat();

    var validationErrors = req.validationErrors();

    if (validationErrors) {
      console.log("Erros de validação encontrados");
      res.status(400).send(validationErrors);
      return;
    }

    var pagamento = req.body;
    console.log("processando pagamento");

    pagamento.status = "criado";
    pagamento.data = new Date();

    var connection = app.persistence.connectionFactory();
    var pagamentoDao = new app.persistence.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(erro, resultado) {
      if (erro) {
          console.log("Ocorreu um erro ao salvar os dados: ", erro);
          res.status(500).send(erro);                
      } else {
        console.log("pagamento criado");
        res.location("/pagamentos/pagamento/" + resultado.insertId);
        res.status(201).json(pagamento);
      }
    });
  });
};
