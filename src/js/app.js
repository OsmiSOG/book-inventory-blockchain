App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    const app = await App.initWeb3();
    return app
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access
        console.error("User denied account access");
      }
    } else if (window.web3) { // Legacy dapp browsers
      App.web3Provider = window.web3.currentProvider;
    } else { // If no injected web3 instance is detected, fall back to ganache 
      App.web3Provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('BookInventory.json', data => {
      App.contracts.BookInventory = new web3.eth.Contract(data.abi, data.networks['5777'].address)
      App.contracts.BookInventory.events.BookAlert().on('data', event => {
        console.log(event.returnValues.success);
        if (event.returnValues.success) {
          swal("Seved!!", "The new book has saved!", "success");
          App.handleInventory()
        } else {
          swal("Upps !!", "Thew new Book cant saved!", "error")
        }
      })
    })
    return App.bindEvents();
  },
  
  bindEvents: function() {
    $(document).on('click', '#addBook', App.handleAddBook);
    $(document).on('click', '#updateInventory', App.handleInventory);
  },

  renderBooks: function (books, account) {
    if (books-$('.card.show').length === 1) {
      App.contracts.BookInventory.methods.getBook(parseInt(books-1)).call({from:account}, (err, result) => {
        if (err) return swal('Upps !!','No se pudo obtener el libro'+book, 'error')
        App.printBook(result)
      })
      return;
    }
    $('#InventoryBook').empty();
    for (let book = 0; book < books; book++) {
      App.contracts.BookInventory.methods.getBook(parseInt(book)).call({from:account}, (err, result) => {
        if (err) return swal('Upps !!','No se pudo obtener el libro'+book, 'error')
        App.printBook(result)
      })
    }
  },

  printBook: function (book) {
    // console.log(book);
    let inventoryRow = $('#InventoryBook');
    let bookTemplate = $('#bookTemplate');

    bookTemplate.find('.identifier').text(book.identifier)
    bookTemplate.find('.name').text(book.name)
    bookTemplate.find('.author').text(book.author)
    bookTemplate.find('.price').text(book.price)
    bookTemplate.find('.cost').text(book.cost)
    bookTemplate.find('.units').text(book.units)
    bookTemplate.find('.card').removeClass('hide').addClass('show');
    inventoryRow.append(bookTemplate.html())
    
    bookTemplate = $('#bookTemplate');
    bookTemplate.find('.card').removeClass('hide show').addClass('hide');

  },

  handleInventory: function(event) {
    event.preventDefault();
    // console.log(App.contracts);
    web3.eth.getAccounts().then( accounts=> {
      const account = accounts[0]
      // console.log(account);
      App.contracts.BookInventory.methods.getIdBooksLength().call({from:account}, (err, result) => {
        if (err) return swal('Upps !!', 'error al obtener libros', 'error')
        App.renderBooks(parseInt(result), account)
      })
    })
  },

  handleAddBook: function(event) {
    event.preventDefault();

    let formBook = document.getElementById("formBook")
    let bookData = new FormData(formBook)
    
    web3.eth.getAccounts(function(error, accounts) {
      if (error) swal('Uppss !!','No se pudo obtener la cuenta', 'error')
    
      const account = accounts[0];
      // console.log(account);

      App.contracts.BookInventory.methods.addBook(
        bookData.get('identifier'),
          bookData.get('name'),
          bookData.get('price'),
          bookData.get('cost'),
          bookData.get('units'),
          bookData.get('author')
      ).send(
        {from: account}
      ).on('receipt', receipt => {
        
      }).on('error', (err, receipt) => {
        swal('Upps', 'error: '+err, 'error')
      })
    })
  }

};

$(function() {
  $(window).ready(function() {
    App.init();
  });
});
