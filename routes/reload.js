function add(server, app_data) {
  function errorFn(err) {
    console.log('Error found. Please trace!');
    console.error(err);
  }

  const saModel = app_data['saModel'];
  const cardModel = app_data['cardModel'];

  server.get('/reload/:id', async function(req, resp) {
    const boardId = req.params.id;

    try {
      const cards = await cardModel.find();
      const symbolToImage = {};
      cards.forEach(card => {
        symbolToImage[card.symbol] = card.image.replace('./images/', '');
      });

      const actions = await saModel.find({ board: boardId });

      const actionList = actions.map(action => ({
        status: action.status,
        location1: action.first,
        location2: action.second,
        symbol1: action.symbol1,
        symbol2: action.symbol2,
        image1: symbolToImage[action.symbol1],
        image2: symbolToImage[action.symbol2]
      }));

      resp.send({ actions: actionList });

    } catch (err) {
      errorFn(err);
      resp.status(500).send("Error loading actions");
    }
  });
}

module.exports.add = add;
