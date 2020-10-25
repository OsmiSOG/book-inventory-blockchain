pragma solidity >=0.4.21 <0.7.0;

contract BookInventory {
    
    event BookAlert(string _message, bool success); 

    struct Book {
        string identifier;
        string name;
        uint price;
        uint cost;
        uint units;
        string author;
    }

    uint public id_book;
    mapping (uint => Book) books;
    uint[] public id_books;

    constructor () public {
        id_book = 0;    
    }

    function addBook(
        string memory _identifier, 
        string memory _name, 
        uint _price, 
        uint _cost, 
        uint _units, 
        string memory _author
    ) public {
        for (uint i = 0; i < id_books.length; i++) {
            if (keccak256(abi.encodePacked(books[i].identifier)) == keccak256(abi.encodePacked(_identifier))) {
                emit BookAlert("Book not saved, the reference already exist!", false);
                return;
            }
        }
        id_books.push(id_book);
        books[id_book] = Book({
            identifier: _identifier,
            name: _name,
            price: _price,
            cost: _cost,
            units: _units,
            author: _author
        });
        id_book += 1;
        emit BookAlert("Book saved successfully!", true);
        return;
    }

    function getBook(uint _id) public view returns (string memory identifier, string memory name, uint price, uint cost, uint units, string memory author) {
        if (keccak256(abi.encodePacked(books[_id].identifier)) == keccak256(abi.encodePacked(""))){
            identifier = "";
            name = "";
            price = 0;
            cost = 0;
            units = 0;
            author = "";
        } else {
            Book storage book = books[_id];
            identifier = book.identifier;
            name = book.name;
            price = book.price;
            cost = book.cost;
            units = book.units;
            author = book.author;
        }
    }

    function getIdBooks() public view returns(uint[] memory) {
        return id_books;
    }

    function getIdBooksLength() public view returns(uint) {
        return id_books.length;
    }
}