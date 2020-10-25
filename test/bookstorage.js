const BookInventory = artifacts.require("BookInventory");

contract("BookInventory", accounts => {
  it("...should get the value 0", async () => {
    const bookStorageInstance = await BookInventory.deployed();

    // Get stored value
    const storedData = await bookStorageInstance.id_book.call();

    assert.equal(storedData, 0, "The value 0 gette.");
  });

  it("...stored new book", async () => {
    const bookStorageInstance = await BookInventory.deployed();

    // Store the new book
    await bookStorageInstance.addBook("CF-02","Mago de Oz",50,30,7,"Dimitry",{ from: accounts[0] });

    const booksLength = await bookStorageInstance.getIdBooksLength.call();
    assert.equal(booksLength, 1, "Books stored have 1")

    const myIdBook = await bookStorageInstance.id_books.call(0);
    assert.equal(myIdBook, 0, "The id for first book is 0")

    const book = await bookStorageInstance.getBook(0,{from: accounts[0]});
    const {0: identifier, 1: name, 2: price, 3: cost, 4:units, 5:author} = book;
    
    assert.equal(identifier, "CF-02", "The value CF-02 get.");
  });

  it("...stored a book same again", async () => {
    const bookStorageInstance = await BookInventory.deployed();

    // Store the new book
    await bookStorageInstance.addBook("CF-02","Mago de Oz",50,30,7,"Dimitry",{ from: accounts[0] });
    eventBook = await bookStorageInstance.addBook("CF-02","Mago de Oz",50,30,7,"Dimitry",{ from: accounts[0] });
    assert.equal(eventBook.logs[0].args['1'], false, "Book is not saved")

    const booksLength = await bookStorageInstance.getIdBooksLength.call();
    assert.equal(booksLength, 1, "Books stored have 1")

    const myIdBook = await bookStorageInstance.id_books.call(0);
    assert.equal(myIdBook, 0, "The id for first book is 0")

    const book = await bookStorageInstance.getBook(0,{from: accounts[0]});
    const {0: identifier, 1: name, 2: price, 3: cost, 4:units, 5:author} = book;
    
    assert.equal(identifier, "CF-02", "The value CF-02 get.");
  });

  it("...stored a book different", async () => {
    const bookStorageInstance = await BookInventory.deployed();

    // Store the new book
    await bookStorageInstance.addBook("CF-02","Mago de Oz",50,30,7,"Dimitry",{ from: accounts[0] });
    eventBook = await bookStorageInstance.addBook("CF-03","Caperuzita y los enanos",40,20,10,"Jackson",{ from: accounts[0] });
    assert.equal(eventBook.logs[0].args['1'], true, "Book is not saved")

    const booksLength = await bookStorageInstance.getIdBooksLength.call();
    assert.equal(booksLength, 2, "Books stored have 2")

    // const myIdBook = await bookStorageInstance.id_books.call(0);
    // assert.equal(myIdBook, 0, "The id for first book is 0")
    // const book = await bookStorageInstance.getBook(0,{from: accounts[0]});
    // const {0: identifier, 1: name, 2: price, 3: cost, 4:units, 5:author} = book;
    
    // assert.equal(identifier, "CF-02", "The value CF-02 get.");
  });
});
