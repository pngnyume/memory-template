function placePiece(act){
  if(act.status==='match'){
    $(`#cell${act.location1}`).addClass('white');
    $(`#cell${act.location2}`).addClass('white');
    $(`#cell${act.location1}`).html(`<img src="${act.image}" />`);
    $(`#cell${act.location2}`).html(`<img src="${act.image}" />`);
  }else if(act.status==='mismatch'){
    const newItem1 = document.createElement('div');
    newItem1.innerHTML = `Cell ${act.location1} contains ${act.symbol1}`;
    $('#results').append(newItem1);
    const newItem2 = document.createElement('div');
    newItem2.innerHTML = `Cell ${act.location2} contains ${act.symbol2}`;
    $('#results').append(newItem2);
    const newItem3 = document.createElement('div');
    newItem3.innerHTML = `Cell ${act.location1} and ${act.location2} do not match!`;
    $('#results').append(newItem3);
  }//if
}

$(document).ready(function(){
  for(let i=1; i<=16; i++){
    $(`#cell${i}`).click(function(){
      if($(`#cell${i}`).html()===''){
        if($('#move').val()===''){
          $('#move').val(String(i));
        }else{
          const first = $('#move').val();
          const second = String(i);
          const board = String($('#board-code').val());
          $.post('/move',{ 
            first: first, second:second, board:board
          },function(data, status){
            if(status==='success')
              placePiece(data);
          });//fn+post
          $('#move').val('');
        }//end else
      }//end if
    });//click
  }//end for
  //Code that loads the previous actions
  $.get(`/reload/${$('#board-code').val()}`,function(data, status){
    if(status==='success'){
      for(let i=0; i<data.actions.length; i++){
        placePiece(data.actions[i]);
      }
    }//end for
  });//fn+post
});
