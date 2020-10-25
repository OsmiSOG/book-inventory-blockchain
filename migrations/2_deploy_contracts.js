let BookInventory = artifacts.require("BookInventory");

module.exports = function (deployer) {
    deployer.deploy(BookInventory)
}