// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title PaymentEscrow - Simple and Secure Escrow Contract for P2P Payments
contract PaymentEscrow {
    enum EscrowStatus { Pending, Released, Refunded, Disputed, Cancelled }

    struct Escrow {
        address payer;
        address payee;
        uint256 amount;
        EscrowStatus status;
        uint64 createdAt;
        uint64 deadline;
    }

    uint256 public escrowCount;
    mapping(uint256 => Escrow) public escrows;

    event EscrowCreated(uint256 indexed escrowId, address indexed payer, address indexed payee, uint256 amount, uint64 deadline);
    event EscrowReleased(uint256 indexed escrowId);
    event EscrowRefunded(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);

    modifier onlyPayer(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].payer, "Not payer");
        _;
    }

    modifier onlyPayee(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].payee, "Not payee");
        _;
    }

    modifier inStatus(uint256 escrowId, EscrowStatus status) {
        require(escrows[escrowId].status == status, "Invalid status");
        _;
    }

    /// @notice Create a new escrow for a payment
    /// @param payee Address to receive funds upon release
    /// @param deadline Unix timestamp after which payer can cancel/refund
    function createEscrow(address payee, uint64 deadline) external payable returns (uint256) {
        require(payee != address(0), "Invalid payee");
        require(msg.value > 0, "No funds sent");
        require(deadline > block.timestamp, "Deadline must be in future");

        escrowCount++;
        escrows[escrowCount] = Escrow({
            payer: msg.sender,
            payee: payee,
            amount: msg.value,
            status: EscrowStatus.Pending,
            createdAt: uint64(block.timestamp),
            deadline: deadline
        });

        emit EscrowCreated(escrowCount, msg.sender, payee, msg.value, deadline);
        return escrowCount;
    }

    /// @notice Release funds to payee (only payer)
    function release(uint256 escrowId)
        external
        onlyPayer(escrowId)
        inStatus(escrowId, EscrowStatus.Pending)
    {
        Escrow storage esc = escrows[escrowId];
        esc.status = EscrowStatus.Released;
        (bool sent, ) = esc.payee.call{value: esc.amount}("");
        require(sent, "Transfer failed");
        emit EscrowReleased(escrowId);
    }

    /// @notice Refund funds to payer (after deadline, only payee can dispute before deadline)
    function refund(uint256 escrowId)
        external
        onlyPayer(escrowId)
        inStatus(escrowId, EscrowStatus.Pending)
    {
        Escrow storage esc = escrows[escrowId];
        require(block.timestamp > esc.deadline, "Deadline not reached");
        esc.status = EscrowStatus.Refunded;
        (bool sent, ) = esc.payer.call{value: esc.amount}("");
        require(sent, "Refund failed");
        emit EscrowRefunded(escrowId);
    }

    /// @notice Dispute the escrow (only payee, before deadline)
    function dispute(uint256 escrowId)
        external
        onlyPayee(escrowId)
        inStatus(escrowId, EscrowStatus.Pending)
    {
        Escrow storage esc = escrows[escrowId];
        require(block.timestamp <= esc.deadline, "Deadline passed");
        esc.status = EscrowStatus.Disputed;
        emit EscrowDisputed(escrowId);
    }

    /// @notice Cancel escrow and refund (only payer, if not claimed/disputed and deadline passed)
    function cancel(uint256 escrowId)
        external
        onlyPayer(escrowId)
        inStatus(escrowId, EscrowStatus.Pending)
    {
        Escrow storage esc = escrows[escrowId];
        require(block.timestamp > esc.deadline, "Deadline not reached");
        esc.status = EscrowStatus.Cancelled;
        (bool sent, ) = esc.payer.call{value: esc.amount}("");
        require(sent, "Refund failed");
        emit EscrowCancelled(escrowId);
    }

    /// @notice View escrow details
    function getEscrow(uint256 escrowId)
        external
        view
        returns (
            address payer,
            address payee,
            uint256 amount,
            EscrowStatus status,
            uint64 createdAt,
            uint64 deadline
        )
    {
        Escrow memory esc = escrows[escrowId];
        return (esc.payer, esc.payee, esc.amount, esc.status, esc.createdAt, esc.deadline);
    }
}
