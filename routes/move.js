function add(server, app_data) {
  function errorFn(err) {
    console.log('Error found. Please trace!');
    console.error(err);
  }

  const saModel = app_data['saModel'];
  const bcModel = app_data['bcModel'];
  const cardModel = app_data['cardModel'];

  server.post('/move', async function(req, resp) {
    const firstCell = req.body.first;
    const secondCell = req.body.second;
    const boardId = req.body.board;

    try {
      const boardInstance = await bcModel.findOne({ _id: boardId });
      if (!boardInstance) {
        return resp.status(404).send("Board not found");
      }

      const board = boardInstance.map;

      const cards = await cardModel.find();
      const symbolToImage = {};
      cards.forEach(card => {
        symbolToImage[card.symbol] = card.image;
      });

      const symbol1 = board[firstCell - 1];
      const symbol2 = board[secondCell - 1];
      const status = (symbol1 === symbol2) ? 'match' : 'mismatch';

      const action = new saModel({
        board: boardId,
        first: firstCell,
        second: secondCell,
        status: status,
        symbol1: symbol1,
        symbol2: symbol2
      });
      await action.save();

      resp.send({
        status: status,
        location1: firstCell,
        location2: secondCell,
        symbol1: symbol1,
        symbol2: symbol2,
        image1: symbolToImage[symbol1] ? symbolToImage[symbol1].replace('/images/', '') : '',
        image2: symbolToImage[symbol2] ? symbolToImage[symbol2].replace('/images/', '') : ''
      });

    } catch (err) {
      errorFn(err);
      resp.status(500).send("Error processing move");
    }
  });
}

module.exports.add = add;
