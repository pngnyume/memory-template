function add(server, app_data) {
  function errorFn(err) {
    console.log('Error found. Please trace!');
    console.error(err);
  }

  const bcModel = app_data['bcModel'];

  server.post('/create_new', async function(req, resp) {
    const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let board = symbols.concat(symbols);

    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }

    const instance = new bcModel({ map: board });
    try {
      const result = await instance.save();
      const boardId = String(result['_id']);
      resp.redirect('/board/' + boardId);
    } catch (err) {
      errorFn(err);
      resp.status(500).send("Error creating board");
    }
  });
}

module.exports.add = add;
