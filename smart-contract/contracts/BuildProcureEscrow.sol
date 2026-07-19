// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BuildProcureEscrow {

    struct Order {
        address contractor;
        address supplier;
        uint256 amount;
        bool funded;
        bool delivered;
        bool released;
    }


    uint256 public orderCount;


    mapping(uint256 => Order) public orders;



    function createOrder(
        address _supplier
    )
    external
    returns(uint256)
    {

        orderCount++;


        orders[orderCount] = Order({

            contractor: msg.sender,

            supplier: _supplier,

            amount: 0,

            funded:false,

            delivered:false,

            released:false

        });


        return orderCount;

    }




    function fundOrder(
        uint256 _orderId
    )
    external
    payable
    {

        Order storage order =
        orders[_orderId];


        require(
            msg.sender == order.contractor,
            "Not contractor"
        );


        require(
            msg.value > 0,
            "No ETH"
        );


        order.amount =
        msg.value;


        order.funded = true;

    }





    function confirmDelivery(
        uint256 _orderId
    )
    external
    {

        Order storage order =
        orders[_orderId];


        require(
            msg.sender == order.supplier,
            "Not supplier"
        );


        require(
            order.funded,
            "Not funded"
        );


        order.delivered=true;

    }






    function releasePayment(
        uint256 _orderId
    )
    external
    {

        Order storage order =
        orders[_orderId];


        require(
            msg.sender == order.contractor,
            "Not contractor"
        );


        require(
            order.delivered,
            "Not delivered"
        );


        require(
            !order.released,
            "Already released"
        );


        order.released=true;


        payable(order.supplier)
        .transfer(order.amount);


    }

}