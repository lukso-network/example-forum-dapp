// Sources flattened with hardhat v2.10.1 https://hardhat.org

// File @openzeppelin/contracts/utils/introspection/IERC165.sol@v4.7.2

// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File @erc725/smart-contracts/contracts/interfaces/IERC725Y.sol@v3.1.2


// interfaces

/**
 * @title The interface for ERC725Y General data key/value store
 * @dev ERC725Y provides the ability to set arbitrary data key/value pairs that can be changed over time
 * It is intended to standardise certain data key/value pairs to allow automated read and writes
 * from/to the contract storage
 */
interface IERC725Y is IERC165 {
    /**
     * @notice Emitted when data at a key is changed
     * @param dataKey The data key which value is set
     */
    event DataChanged(bytes32 indexed dataKey);

    /**
     * @notice Gets singular data at a given `dataKey`
     * @param dataKey The key which value to retrieve
     * @return dataValue The data stored at the key
     */
    function getData(bytes32 dataKey) external view returns (bytes memory dataValue);

    /**
     * @notice Gets array of data for multiple given keys
     * @param dataKeys The array of keys which values to retrieve
     * @return dataValues The array of data stored at multiple keys
     */
    function getData(bytes32[] memory dataKeys) external view returns (bytes[] memory dataValues);

    /**
     * @notice Sets singular data for a given `dataKey`
     * @param dataKey The key to retrieve stored value
     * @param dataValue The value to set
     * SHOULD only be callable by the owner of the contract set via ERC173
     *
     * Emits a {DataChanged} event.
     */
    function setData(bytes32 dataKey, bytes memory dataValue) external;

    /**
     * @param dataKeys The array of data keys for values to set
     * @param dataValues The array of values to set
     * @dev Sets array of data for multiple given `dataKeys`
     * SHOULD only be callable by the owner of the contract set via ERC173
     *
     * Emits a {DataChanged} event.
     */
    function setData(bytes32[] memory dataKeys, bytes[] memory dataValues) external;
}


// File @erc725/smart-contracts/contracts/utils/GasLib.sol@v3.1.2


/**
 * @dev Library to add all efficient functions that could get repeated.
 */
library GasLib {
    /**
     * @dev Will return unchecked incremented uint256
     */
    function uncheckedIncrement(uint256 i) internal pure returns (uint256) {
        unchecked {
            return i + 1;
        }
    }
}


// File @openzeppelin/contracts/utils/introspection/ERC165.sol@v4.7.2

// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165.sol)


/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 *
 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}


// File @erc725/smart-contracts/contracts/custom/OwnableUnset.sol@v3.1.2


/**
 * @title OwnableUnset
 * @dev modified version of OpenZeppelin implementation, where:
 * - _setOwner(address) function is internal, so this function can be used in constructor
 * of contracts implementation (instead of using transferOwnership(address)
 * - the contract does not inherit from Context contract
 */
abstract contract OwnableUnset {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _setOwner(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwner(newOwner);
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
    }

    /**
     * @dev Changes the owner if `newOwner` and oldOwner are different
     * This pattern is useful in inheritance.
     */
    function _setOwner(address newOwner) internal virtual {
        if (newOwner != owner()) {
            address oldOwner = _owner;
            _owner = newOwner;
            emit OwnershipTransferred(oldOwner, newOwner);
        }
    }
}


// File @erc725/smart-contracts/contracts/constants.sol@v3.1.2


// >> ERC165 INTERFACE IDs

// ERC725 - Smart Contract based Account
bytes4 constant _INTERFACEID_ERC725X = 0x44c028fe;
bytes4 constant _INTERFACEID_ERC725Y = 0x714df77c;

// >> ERC725X OPERATIONS TYPES
uint256 constant OPERATION_CALL = 0;
uint256 constant OPERATION_CREATE = 1;
uint256 constant OPERATION_CREATE2 = 2;
uint256 constant OPERATION_STATICCALL = 3;
uint256 constant OPERATION_DELEGATECALL = 4;

// ERC725Y overloaded function selectors
bytes4 constant SETDATA_SELECTOR = bytes4(keccak256("setData(bytes32,bytes)"));
bytes4 constant SETDATA_ARRAY_SELECTOR = bytes4(keccak256("setData(bytes32[],bytes[])"));


// File @erc725/smart-contracts/contracts/ERC725YCore.sol@v3.1.2


// interfaces


// libraries

// modules


// constants

/**
 * @title Core implementation of ERC725Y General data key/value store
 * @author Fabian Vogelsteller <fabian@lukso.network>
 * @dev Contract module which provides the ability to set arbitrary data key/value pairs that can be changed over time
 * It is intended to standardise certain data key/value pairs to allow automated read and writes
 * from/to the contract storage
 */
abstract contract ERC725YCore is OwnableUnset, ERC165, IERC725Y {
    /**
     * @dev Map the dataKeys to their dataValues
     */
    mapping(bytes32 => bytes) internal store;

    /* Public functions */
    /**
     * @inheritdoc IERC725Y
     */
    function getData(bytes32 dataKey)
        public
        view
        virtual
        override
        returns (bytes memory dataValue)
    {
        dataValue = _getData(dataKey);
    }

    /**
     * @inheritdoc IERC725Y
     */
    function getData(bytes32[] memory dataKeys)
        public
        view
        virtual
        override
        returns (bytes[] memory dataValues)
    {
        dataValues = new bytes[](dataKeys.length);

        for (uint256 i = 0; i < dataKeys.length; i = GasLib.uncheckedIncrement(i)) {
            dataValues[i] = _getData(dataKeys[i]);
        }

        return dataValues;
    }

    /**
     * @inheritdoc IERC725Y
     */
    function setData(bytes32 dataKey, bytes memory dataValue) public virtual override onlyOwner {
        _setData(dataKey, dataValue);
    }

    /**
     * @inheritdoc IERC725Y
     */
    function setData(bytes32[] memory dataKeys, bytes[] memory dataValues)
        public
        virtual
        override
        onlyOwner
    {
        require(dataKeys.length == dataValues.length, "Keys length not equal to values length");
        for (uint256 i = 0; i < dataKeys.length; i = GasLib.uncheckedIncrement(i)) {
            _setData(dataKeys[i], dataValues[i]);
        }
    }

    /* Internal functions */

    function _getData(bytes32 dataKey) internal view virtual returns (bytes memory dataValue) {
        return store[dataKey];
    }

    function _setData(bytes32 dataKey, bytes memory dataValue) internal virtual {
        store[dataKey] = dataValue;
        emit DataChanged(dataKey);
    }

    /* Overrides functions */

    /**
     * @inheritdoc ERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, ERC165)
        returns (bool)
    {
        return interfaceId == _INTERFACEID_ERC725Y || super.supportsInterface(interfaceId);
    }
}


// File @erc725/smart-contracts/contracts/ERC725Y.sol@v3.1.2


// modules



/**
 * @title ERC725Y General data key/value store
 * @author Fabian Vogelsteller <fabian@lukso.network>
 * @dev Contract module which provides the ability to set arbitrary data key/value pairs that can be changed over time
 * It is intended to standardise certain data key/value pairs to allow automated read and writes
 * from/to the contract storage
 */
contract ERC725Y is ERC725YCore {
    /**
     * @notice Sets the owner of the contract
     * @param newOwner the owner of the contract
     */
    constructor(address newOwner) {
        OwnableUnset._setOwner(newOwner);
    }
}


// File @lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol@v0.6.2


// --- ERC725Y entries

// bytes10(keccak256('SupportedStandards')) + bytes2(0) + bytes20(keccak256('LSP4DigitalAsset'))
bytes32 constant _LSP4_SUPPORTED_STANDARDS_KEY = 0xeafec4d89fa9619884b60000a4d96624a38f7ac2d8d9a604ecf07c12c77e480c;

// bytes4(keccak256('LSP4DigitalAsset'))
bytes constant _LSP4_SUPPORTED_STANDARDS_VALUE = hex"a4d96624";

// keccak256('LSP4TokenName')
bytes32 constant _LSP4_TOKEN_NAME_KEY = 0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af1;

// keccak256('LSP4TokenSymbol')
bytes32 constant _LSP4_TOKEN_SYMBOL_KEY = 0x2f0a68ab07768e01943a599e73362a0e17a63a72e94dd2e384d2c1d4db932756;

// keccak256('LSP4Creators[]')
bytes32 constant _LSP4_CREATORS_ARRAY_KEY = 0x114bd03b3a46d48759680d81ebb2b414fda7d030a7105a851867accf1c2352e7;

// bytes10(keccak256('LSP4CreatorsMap')) + bytes2(0)
bytes12 constant _LSP4_CREATORS_MAP_KEY_PREFIX = 0x6de85eaf5d982b4e5da00000;

// keccak256('LSP4Metadata')
bytes32 constant _LSP4_METADATA_KEY = 0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e;


// File @lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Errors.sol@v0.6.2


/**
 * @dev Reverts when trying to edit the data key `LSP4TokenName` after the digital asset contract has been deployed.
 *      The `LSP4TokenName` data key is located inside the ERC725Y key-value store of the digital asset contract.
 *      It can be set only once inside the constructor/initializer when the digital asset contract is being deployed.
 */
error LSP4TokenNameNotEditable();

/**
 * @dev Reverts when trying to edit the data key `LSP4TokenSymbol` after the digital asset contract has been deployed.
 *      The `LSP4TokenSymbol` data key is located inside the ERC725Y key-value store of the digital asset contract.
 *      It can be set only once inside the constructor/initializer when the digital asset contract is being deployed.
 */
error LSP4TokenSymbolNotEditable();


// File @lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4DigitalAssetMetadata.sol@v0.6.2


// modules

// constants

// errors

/**
 * @title LSP4DigitalAssetMetadata
 * @author Matthew Stevens
 * @dev Implementation of a LSP8 compliant contract.
 */
abstract contract LSP4DigitalAssetMetadata is ERC725Y {
    /**
     * @notice Sets the name, symbol of the token and the owner, and sets the SupportedStandards:LSP4DigitalAsset key
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param newOwner_ The owner of the token contract
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_
    ) ERC725Y(newOwner_) {
        // set key SupportedStandards:LSP4DigitalAsset
        super._setData(_LSP4_SUPPORTED_STANDARDS_KEY, _LSP4_SUPPORTED_STANDARDS_VALUE);

        super._setData(_LSP4_TOKEN_NAME_KEY, bytes(name_));
        super._setData(_LSP4_TOKEN_SYMBOL_KEY, bytes(symbol_));
    }

    /**
     * @dev the ERC725Y data keys `LSP4TokenName` and `LSP4TokenSymbol` cannot be changed via this function
     *      once the digital asset contract has been deployed
     */
    function _setData(bytes32 key, bytes memory value) internal virtual override {
        if (key == _LSP4_TOKEN_NAME_KEY) {
            revert LSP4TokenNameNotEditable();
        } else if (key == _LSP4_TOKEN_SYMBOL_KEY) {
            revert LSP4TokenSymbolNotEditable();
        } else {
            super._setData(key, value);
        }
    }
}


// File @lukso/lsp-smart-contracts/contracts/LSP1UniversalReceiver/ILSP1UniversalReceiver.sol@v0.6.2


/**
 * @title The interface for LSP1UniversalReceiver
 * @dev LSP1UniversalReceiver allows to receive arbitrary messages and to be informed when assets are sent or received
 */
interface ILSP1UniversalReceiver {
    /**
     * @notice Emitted when the universalReceiver function is succesfully executed
     * @param from The address calling the universalReceiver function
     * @param value The amount sent to the universalReceiver function
     * @param typeId The hash of a specific standard or a hook
     * @param returnedValue The return value of universalReceiver function
     * @param receivedData The arbitrary data passed to universalReceiver function
     */
    event UniversalReceiver(
        address indexed from,
        uint256 value,
        bytes32 indexed typeId,
        bytes indexed returnedValue,
        bytes receivedData
    );

    /**
     * @param typeId The hash of a specific standard or a hook
     * @param data The arbitrary data received with the call
     * @dev Emits an event when it's succesfully executed
     *
     * Call the universalReceiverDelegate function in the UniversalReceiverDelegate (URD) contract, if the address of the URD
     * was set as a value for the `_UniversalReceiverKey` in the account key/value value store of the same contract implementing
     * the universalReceiver function and if the URD contract has the LSP1UniversalReceiverDelegate Interface Id registred using ERC165
     *
     * Emits a {UniversalReceiver} event
     */
    function universalReceiver(bytes32 typeId, bytes calldata data)
        external
        payable
        returns (bytes memory);
}


// File @lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/ILSP7DigitalAsset.sol@v0.6.2



// interfaces


/**
 * @dev Required interface of a LSP8 compliant contract.
 */
interface ILSP7DigitalAsset is IERC165, IERC725Y {
    // --- Events

    /**
     * @dev Emitted when `amount` tokens is transferred from `from` to `to`.
     * @param operator The address of operator sending tokens
     * @param from The address which tokens are sent
     * @param to The receiving address
     * @param amount The amount of tokens transferred
     * @param force When set to TRUE, `to` may be any address but
     * when set to FALSE `to` must be a contract that supports LSP1 UniversalReceiver
     * @param data Additional data the caller wants included in the emitted event, and sent in the hooks to `from` and `to` addresses
     */
    event Transfer(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 amount,
        bool force,
        bytes data
    );

    /**
     * @dev Emitted when `tokenOwner` enables `operator` for `amount` tokens.
     * @param operator The address authorized as an operator
     * @param tokenOwner The token owner
     * @param amount The amount of tokens `operator` address has access to from `tokenOwner`
     */
    event AuthorizedOperator(
        address indexed operator,
        address indexed tokenOwner,
        uint256 indexed amount
    );

    /**
     * @dev Emitted when `tokenOwner` disables `operator` for `amount` tokens.
     * @param operator The address revoked from operating
     * @param tokenOwner The token owner
     */
    event RevokedOperator(address indexed operator, address indexed tokenOwner);

    // --- Token queries

    /**
     * @dev Returns the number of decimals used to get its user representation
     * If the contract represents a NFT then 0 SHOULD be used, otherwise 18 is the common value
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {balanceOf} and {transfer}.
     */
    function decimals() external view returns (uint256);

    /**
     * @dev Returns the number of existing tokens.
     * @return The number of existing tokens
     */
    function totalSupply() external view returns (uint256);

    // --- Token owner queries

    /**
     * @dev Returns the number of tokens owned by `tokenOwner`.
     * @param tokenOwner The address to query
     * @return The number of tokens owned by this address
     */
    function balanceOf(address tokenOwner) external view returns (uint256);

    // --- Operator functionality

    /**
     * @param operator The address to authorize as an operator.
     * @param amount The amount of tokens operator has access to.
     * @dev Sets `amount` as the amount of tokens `operator` address has access to from callers tokens.
     *
     * See {isOperatorFor}.
     *
     * Requirements
     *
     * - `operator` cannot be the zero address.
     *
     * Emits an {AuthorizedOperator} event.
     */
    function authorizeOperator(address operator, uint256 amount) external;

    /**
     * @param operator The address to revoke as an operator.
     * @dev Removes `operator` address as an operator of callers tokens.
     *
     * See {isOperatorFor}.
     *
     * Requirements
     *
     * - `operator` cannot be the zero address.
     *
     * Emits a {RevokedOperator} event.
     */
    function revokeOperator(address operator) external;

    /**
     * @param operator The address to query operator status for.
     * @param tokenOwner The token owner.
     * @return The amount of tokens `operator` address has access to from `tokenOwner`.
     * @dev Returns amount of tokens `operator` address has access to from `tokenOwner`.
     * Operators can send and burn tokens on behalf of their owners. The tokenOwner is their own
     * operator.
     */
    function isOperatorFor(address operator, address tokenOwner) external view returns (uint256);

    // --- Transfer functionality

    /**
     * @param from The sending address.
     * @param to The receiving address.
     * @param amount The amount of tokens to transfer.
     * @param force When set to TRUE, to may be any address but
     * when set to FALSE to must be a contract that supports LSP1 UniversalReceiver
     * @param data Additional data the caller wants included in the emitted event, and sent in the hooks to `from` and `to` addresses.
     *
     * @dev Transfers `amount` of tokens from `from` to `to`. The `force` parameter will be used
     * when notifying the token sender and receiver.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `amount` tokens must be owned by `from`.
     * - If the caller is not `from`, it must be an operator for `from` with access to at least
     * `amount` tokens.
     *
     * Emits a {Transfer} event.
     */
    function transfer(
        address from,
        address to,
        uint256 amount,
        bool force,
        bytes memory data
    ) external;

    /**
     * @param from The list of sending addresses.
     * @param to The list of receiving addresses.
     * @param amount The amount of tokens to transfer.
     * @param force When set to TRUE, to may be any address but
     * when set to FALSE to must be a contract that supports LSP1 UniversalReceiver
     * @param data Additional data the caller wants included in the emitted event, and sent in the hooks to `from` and `to` addresses.
     *
     * @dev Transfers many tokens based on the list `from`, `to`, `amount`. If any transfer fails
     * the call will revert.
     *
     * Requirements:
     *
     * - `from`, `to`, `amount` lists are the same length.
     * - no values in `from` can be the zero address.
     * - no values in `to` can be the zero address.
     * - each `amount` tokens must be owned by `from`.
     * - If the caller is not `from`, it must be an operator for `from` with access to at least
     * `amount` tokens.
     *
     * Emits {Transfer} events.
     */
    function transferBatch(
        address[] memory from,
        address[] memory to,
        uint256[] memory amount,
        bool force,
        bytes[] memory data
    ) external;
}


// File @lukso/lsp-smart-contracts/contracts/Custom/ERC165Checker.sol@v0.6.2

// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165Checker.sol)


// This contract is a modified version of OpenZeppelin implementation, where we modify the visibility of
// `supportsERC165Interface`, which check the given interfaceId, to internal and to be used in contract implementations,
// instead of `supportsInterface` to save gas, as the latter check for 3 interfaceIds; InterfaceId of ERC165, 0xffffffff
// and the given interfaceId.

// interfaces

/**
 * @dev Library used to query support of an interface declared via {IERC165}.
 *
 * Note that these functions return the actual result of the query: they do not
 * `revert` if an interface is not supported. It is up to the caller to decide
 * what to do in these cases.
 */
library ERC165Checker {
    // As per the EIP-165 spec, no interface should ever match 0xffffffff
    bytes4 private constant _INTERFACE_ID_INVALID = 0xffffffff;

    /**
     * @dev Returns true if `account` supports the {IERC165} interface,
     */
    function supportsERC165(address account) internal view returns (bool) {
        // Any contract that implements ERC165 must explicitly indicate support of
        // InterfaceId_ERC165 and explicitly indicate non-support of InterfaceId_Invalid
        return
            supportsERC165Interface(account, type(IERC165).interfaceId) &&
            !supportsERC165Interface(account, _INTERFACE_ID_INVALID);
    }

    /**
     * @dev Returns true if `account` supports the interface defined by
     * `interfaceId`. Support for {IERC165} itself is queried automatically.
     *
     * See {IERC165-supportsInterface}.
     */
    function supportsInterface(address account, bytes4 interfaceId) internal view returns (bool) {
        // query support of both ERC165 as per the spec and support of _interfaceId
        return supportsERC165(account) && supportsERC165Interface(account, interfaceId);
    }

    /**
     * @dev Returns a boolean array where each value corresponds to the
     * interfaces passed in and whether they're supported or not. This allows
     * you to batch check interfaces for a contract where your expectation
     * is that some interfaces may not be supported.
     *
     * See {IERC165-supportsInterface}.
     *
     * _Available since v3.4._
     */
    function getSupportedInterfaces(address account, bytes4[] memory interfaceIds)
        internal
        view
        returns (bool[] memory)
    {
        // an array of booleans corresponding to interfaceIds and whether they're supported or not
        bool[] memory interfaceIdsSupported = new bool[](interfaceIds.length);

        // query support of ERC165 itself
        if (supportsERC165(account)) {
            // query support of each interface in interfaceIds
            for (uint256 i = 0; i < interfaceIds.length; i++) {
                interfaceIdsSupported[i] = supportsERC165Interface(account, interfaceIds[i]);
            }
        }

        return interfaceIdsSupported;
    }

    /**
     * @dev Returns true if `account` supports all the interfaces defined in
     * `interfaceIds`. Support for {IERC165} itself is queried automatically.
     *
     * Batch-querying can lead to gas savings by skipping repeated checks for
     * {IERC165} support.
     *
     * See {IERC165-supportsInterface}.
     */
    function supportsAllInterfaces(address account, bytes4[] memory interfaceIds)
        internal
        view
        returns (bool)
    {
        // query support of ERC165 itself
        if (!supportsERC165(account)) {
            return false;
        }

        // query support of each interface in _interfaceIds
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            if (!supportsERC165Interface(account, interfaceIds[i])) {
                return false;
            }
        }

        // all interfaces supported
        return true;
    }

    /**
     * @notice Query if a contract implements an interface, does not check ERC165 support
     * @param account The address of the contract to query for support of an interface
     * @param interfaceId The interface identifier, as specified in ERC-165
     * @return true if the contract at account indicates support of the interface with
     * identifier interfaceId, false otherwise
     * @dev Assumes that account contains a contract that supports ERC165, otherwise
     * the behavior of this method is undefined. This precondition can be checked
     * with {supportsERC165}.
     * Interface identification is specified in ERC-165.
     */
    function supportsERC165Interface(address account, bytes4 interfaceId)
        internal
        view
        returns (bool)
    {
        bytes memory encodedParams = abi.encodeWithSelector(
            IERC165.supportsInterface.selector,
            interfaceId
        );
        (bool success, bytes memory result) = account.staticcall{gas: 30000}(encodedParams);
        if (result.length < 32) return false;
        return success && abi.decode(result, (bool));
    }
}


// File @openzeppelin/contracts/utils/structs/EnumerableSet.sol@v4.7.2

// OpenZeppelin Contracts (last updated v4.7.0) (utils/structs/EnumerableSet.sol)


/**
 * @dev Library for managing
 * https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
 * types.
 *
 * Sets have the following properties:
 *
 * - Elements are added, removed, and checked for existence in constant time
 * (O(1)).
 * - Elements are enumerated in O(n). No guarantees are made on the ordering.
 *
 * ```
 * contract Example {
 *     // Add the library methods
 *     using EnumerableSet for EnumerableSet.AddressSet;
 *
 *     // Declare a set state variable
 *     EnumerableSet.AddressSet private mySet;
 * }
 * ```
 *
 * As of v3.3.0, sets of type `bytes32` (`Bytes32Set`), `address` (`AddressSet`)
 * and `uint256` (`UintSet`) are supported.
 *
 * [WARNING]
 * ====
 *  Trying to delete such a structure from storage will likely result in data corruption, rendering the structure unusable.
 *  See https://github.com/ethereum/solidity/pull/11843[ethereum/solidity#11843] for more info.
 *
 *  In order to clean an EnumerableSet, you can either remove all elements one by one or create a fresh instance using an array of EnumerableSet.
 * ====
 */
library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;
        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping(bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            if (lastIndex != toDeleteIndex) {
                bytes32 lastValue = set._values[lastIndex];

                // Move the last value to the index where the value to delete is
                set._values[toDeleteIndex] = lastValue;
                // Update the index for the moved value
                set._indexes[lastValue] = valueIndex; // Replace lastValue's index to valueIndex
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        return set._values[index];
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function _values(Set storage set) private view returns (bytes32[] memory) {
        return set._values;
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
        return _values(set._inner);
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(AddressSet storage set) internal view returns (address[] memory) {
        bytes32[] memory store = _values(set._inner);
        address[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(UintSet storage set) internal view returns (uint256[] memory) {
        bytes32[] memory store = _values(set._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }
}


// File @openzeppelin/contracts/utils/Address.sol@v4.7.2

// OpenZeppelin Contracts (last updated v4.7.0) (utils/Address.sol)


/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly
                /// @solidity memory-safe-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}


// File @openzeppelin/contracts/utils/Context.sol@v4.7.2

// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)


/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


// File @lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/LSP7Errors.sol@v0.6.2


// --- Errors

error LSP7AmountExceedsBalance(uint256 balance, address tokenOwner, uint256 amount);

error LSP7AmountExceedsAuthorizedAmount(
    address tokenOwner,
    uint256 authorizedAmount,
    address operator,
    uint256 amount
);

error LSP7CannotUseAddressZeroAsOperator();

error LSP7CannotSendWithAddressZero();

error LSP7InvalidTransferBatch();

error LSP7NotifyTokenReceiverContractMissingLSP1Interface(address tokenReceiver);

error LSP7NotifyTokenReceiverIsEOA(address tokenReceiver);


// File @lukso/lsp-smart-contracts/contracts/LSP1UniversalReceiver/LSP1Constants.sol@v0.6.2


// --- ERC165 interface ids
bytes4 constant _INTERFACEID_LSP1 = 0x6bb56a14;
bytes4 constant _INTERFACEID_LSP1_DELEGATE = 0xa245bbda;

// --- ERC725Y Keys

// keccak256('LSP1UniversalReceiverDelegate')
bytes32 constant _LSP1_UNIVERSAL_RECEIVER_DELEGATE_KEY = 0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47;


// File @lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/LSP7Constants.sol@v0.6.2


// --- ERC165 interface ids
bytes4 constant _INTERFACEID_LSP7 = 0xe33f65c3;

// --- Token Hooks

// keccak256('LSP7TokensSender')
bytes32 constant _TYPEID_LSP7_TOKENSSENDER = 0x40b8bec57d7b5ff0dbd9e9acd0a47dfeb0101e1a203766f5ccab00445fbf39e9;

// keccak256('LSP7TokensRecipient')
bytes32 constant _TYPEID_LSP7_TOKENSRECIPIENT = 0xdbe2c314e1aee2970c72666f2ebe8933a8575263ea71e5ff6a9178e95d47a26f;


// File @lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/LSP7DigitalAssetCore.sol@v0.6.2


// interfaces


// libraries

// modules




// errors

// constants


/**
 * @title LSP7DigitalAsset contract
 * @author Matthew Stevens
 * @dev Core Implementation of a LSP7 compliant contract.
 *
 * This contract implement the core logic of the functions for the {ILSP7DigitalAsset} interface.
 */
abstract contract LSP7DigitalAssetCore is Context, ILSP7DigitalAsset {
    using Address for address;

    // --- Storage

    bool internal _isNFT;

    uint256 internal _existingTokens;

    // Mapping from `tokenOwner` to an `amount` of tokens
    mapping(address => uint256) internal _tokenOwnerBalances;

    // Mapping a `tokenOwner` to an `operator` to `amount` of tokens.
    mapping(address => mapping(address => uint256)) internal _operatorAuthorizedAmount;

    // --- Token queries

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function decimals() public view override returns (uint256) {
        return _isNFT ? 0 : 18;
    }

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function totalSupply() public view override returns (uint256) {
        return _existingTokens;
    }

    // --- Token owner queries

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function balanceOf(address tokenOwner) public view override returns (uint256) {
        return _tokenOwnerBalances[tokenOwner];
    }

    // --- Operator functionality

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function authorizeOperator(address operator, uint256 amount) public virtual override {
        _updateOperator(_msgSender(), operator, amount);
    }

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function revokeOperator(address operator) public virtual override {
        _updateOperator(_msgSender(), operator, 0);
    }

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function isOperatorFor(address operator, address tokenOwner)
        public
        view
        virtual
        override
        returns (uint256)
    {
        if (tokenOwner == operator) {
            return _tokenOwnerBalances[tokenOwner];
        } else {
            return _operatorAuthorizedAmount[tokenOwner][operator];
        }
    }

    // --- Transfer functionality

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function transfer(
        address from,
        address to,
        uint256 amount,
        bool force,
        bytes memory data
    ) public virtual override {
        address operator = _msgSender();
        if (operator != from) {
            uint256 operatorAmount = _operatorAuthorizedAmount[from][operator];
            if (amount > operatorAmount) {
                revert LSP7AmountExceedsAuthorizedAmount(from, operatorAmount, operator, amount);
            }

            _updateOperator(from, operator, operatorAmount - amount);
        }

        _transfer(from, to, amount, force, data);
    }

    /**
     * @inheritdoc ILSP7DigitalAsset
     */
    function transferBatch(
        address[] memory from,
        address[] memory to,
        uint256[] memory amount,
        bool force,
        bytes[] memory data
    ) public virtual override {
        if (
            from.length != to.length || from.length != amount.length || from.length != data.length
        ) {
            revert LSP7InvalidTransferBatch();
        }

        for (uint256 i = 0; i < from.length; i++) {
            // using the public transfer function to handle updates to operator authorized amounts
            transfer(from[i], to[i], amount[i], force, data[i]);
        }
    }

    /**
     * @dev Changes token `amount` the `operator` has access to from `tokenOwner` tokens. If the
     * amount is zero then the operator is being revoked, otherwise the operator amount is being
     * modified.
     *
     * See {isOperatorFor}.
     *
     * Emits either {AuthorizedOperator} or {RevokedOperator} event.
     *
     * Requirements
     *
     * - `operator` cannot be the zero address.
     */
    function _updateOperator(
        address tokenOwner,
        address operator,
        uint256 amount
    ) internal virtual {
        if (operator == address(0)) {
            revert LSP7CannotUseAddressZeroAsOperator();
        }

        // tokenOwner is always their own operator, no update required
        if (operator == tokenOwner) {
            return;
        }

        _operatorAuthorizedAmount[tokenOwner][operator] = amount;

        if (amount != 0) {
            emit AuthorizedOperator(operator, tokenOwner, amount);
        } else {
            emit RevokedOperator(operator, tokenOwner);
        }
    }

    /**
     * @dev Mints `amount` tokens and transfers it to `to`.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(
        address to,
        uint256 amount,
        bool force,
        bytes memory data
    ) internal virtual {
        if (to == address(0)) {
            revert LSP7CannotSendWithAddressZero();
        }

        address operator = _msgSender();

        _beforeTokenTransfer(address(0), to, amount);

        _tokenOwnerBalances[to] += amount;

        emit Transfer(operator, address(0), to, amount, force, data);

        _notifyTokenReceiver(address(0), to, amount, force, data);
    }

    /**
     * @dev Destroys `amount` tokens.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `from` must have at least `amount` tokens.
     * - If the caller is not `from`, it must be an operator for `from` with access to at least
     * `amount` tokens.
     *
     * Emits a {Transfer} event.
     */
    function _burn(
        address from,
        uint256 amount,
        bytes memory data
    ) internal virtual {
        if (from == address(0)) {
            revert LSP7CannotSendWithAddressZero();
        }

        uint256 balance = _tokenOwnerBalances[from];
        if (amount > balance) {
            revert LSP7AmountExceedsBalance(balance, from, amount);
        }

        address operator = _msgSender();
        if (operator != from) {
            uint256 authorizedAmount = _operatorAuthorizedAmount[from][operator];
            if (amount > authorizedAmount) {
                revert LSP7AmountExceedsAuthorizedAmount(from, authorizedAmount, operator, amount);
            }
            _operatorAuthorizedAmount[from][operator] -= amount;
        }

        _beforeTokenTransfer(from, address(0), amount);

        _tokenOwnerBalances[from] -= amount;

        emit Transfer(operator, from, address(0), amount, false, data);

        _notifyTokenSender(from, address(0), amount, data);
    }

    /**
     * @dev Transfers `amount` tokens from `from` to `to`.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `from` cannot be the zero address.
     * - `from` must have at least `amount` tokens.
     * - If the caller is not `from`, it must be an operator for `from` with access to at least
     * `amount` tokens.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount,
        bool force,
        bytes memory data
    ) internal virtual {
        if (from == address(0) || to == address(0)) {
            revert LSP7CannotSendWithAddressZero();
        }

        uint256 balance = _tokenOwnerBalances[from];
        if (amount > balance) {
            revert LSP7AmountExceedsBalance(balance, from, amount);
        }

        address operator = _msgSender();

        _beforeTokenTransfer(from, to, amount);

        _tokenOwnerBalances[from] -= amount;
        _tokenOwnerBalances[to] += amount;

        emit Transfer(operator, from, to, amount, force, data);

        _notifyTokenSender(from, to, amount, data);
        _notifyTokenReceiver(from, to, amount, force, data);
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `amount` tokens will be
     * transferred to `to`.
     * - When `from` is zero, `amount` tokens will be minted for `to`.
     * - When `to` is zero, ``from``'s `amount` tokens will be burned.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        // tokens being minted
        if (from == address(0)) {
            _existingTokens += amount;
        }

        // tokens being burned
        if (to == address(0)) {
            _existingTokens -= amount;
        }
    }

    /**
     * @dev An attempt is made to notify the token sender about the `amount` tokens changing owners using
     * LSP1 interface.
     */
    function _notifyTokenSender(
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) internal virtual {
        if (ERC165Checker.supportsERC165Interface(from, _INTERFACEID_LSP1)) {
            bytes memory packedData = abi.encodePacked(from, to, amount, data);
            ILSP1UniversalReceiver(from).universalReceiver(_TYPEID_LSP7_TOKENSSENDER, packedData);
        }
    }

    /**
     * @dev An attempt is made to notify the token receiver about the `amount` tokens changing owners
     * using LSP1 interface. When force is FALSE the token receiver MUST support LSP1.
     *
     * The receiver may revert when the token being sent is not wanted.
     */
    function _notifyTokenReceiver(
        address from,
        address to,
        uint256 amount,
        bool force,
        bytes memory data
    ) internal virtual {
        if (ERC165Checker.supportsERC165Interface(to, _INTERFACEID_LSP1)) {
            bytes memory packedData = abi.encodePacked(from, to, amount, data);
            ILSP1UniversalReceiver(to).universalReceiver(_TYPEID_LSP7_TOKENSRECIPIENT, packedData);
        } else if (!force) {
            if (to.code.length != 0) {
                revert LSP7NotifyTokenReceiverContractMissingLSP1Interface(to);
            } else {
                revert LSP7NotifyTokenReceiverIsEOA(to);
            }
        }
    }
}


// File @lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/LSP7DigitalAsset.sol@v0.6.2


// interfaces

// modules



// constants

/**
 * @title LSP7DigitalAsset contract
 * @author Matthew Stevens
 * @dev Implementation of a LSP7 compliant contract.
 *
 * This implementation is agnostic to the way tokens are created.
 * A supply mechanism has to be added in a derived contract using {_mint}
 * For a generic mechanism, see {LSP7Mintable}.
 */
contract LSP7DigitalAsset is LSP4DigitalAssetMetadata, LSP7DigitalAssetCore {
    /**
     * @notice Sets the token-Metadata
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param newOwner_ The owner of the the token-Metadata
     * @param isNFT_ Specify if the LSP7 token is a fungible or non-fungible token
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        bool isNFT_
    ) LSP4DigitalAssetMetadata(name_, symbol_, newOwner_) {
        _isNFT = isNFT_;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, ERC725YCore)
        returns (bool)
    {
        return interfaceId == _INTERFACEID_LSP7 || super.supportsInterface(interfaceId);
    }
}


// File contracts/ForumNFT.sol

//SPDX-License-Identifier: Unlicense

contract ForumNFT is  LSP7DigitalAsset {

    struct Comment {
      string cid;
      address commentor;
      uint256 id;
    }

    struct Post {
      string cid;
      address author;
      address[] likes;
      Comment[] comments;
      uint256 id;
    }

    Post latestPost;
    address[] private emptyLikesArr;
    Comment[] private emptyCommentsArr;
    Comment[] private tempCommentsArr; //used for comments deleting since we cannot pop struct's arrays
    uint[] public postsIds;

    mapping(uint256 => Post) public postByTokenId;

    uint256 private postsCounter;
    uint256 private commentsCounter;

    address private admin;

    constructor(
      string memory _name,
      string memory _symbol,
      address _newOwner,
      bool _isNFT
    ) LSP7DigitalAsset(_name, _symbol, _newOwner, _isNFT) {
      admin = msg.sender;
    }

    modifier onlyAdmin {
      require(msg.sender == admin);
      _;
    }


    //POSTS FUNCTIONS
    function createPost(string calldata _cid) public {

      latestPost.cid = _cid;
      latestPost.author = msg.sender;
      latestPost.likes = emptyLikesArr;
      latestPost.id = ++postsCounter;

      postByTokenId[postsCounter] = latestPost;
      postsIds.push(postsCounter);

      _mint(msg.sender, postsCounter, true, "");
    }

    function editPost(uint256 _tokenId, string calldata _cid) public {
      require(postByTokenId[_tokenId].author == msg.sender, 'Only author can edit post');
      postByTokenId[_tokenId].cid = _cid;
    }

    function deletePost(uint256 _tokenId) public {
      require(postByTokenId[_tokenId].author == msg.sender
        || admin == msg.sender, 'author or admin can delete post');

      uint256[] memory postsList = postsIds;
      uint256 totalPosts = postsList.length;
      uint256 postIndex;
      for (uint256 i = 0; i < totalPosts;) {
        if (postsList[i] == _tokenId) {
          postIndex = i;
          break;
        }
        unchecked {++i;}
      }

      for(uint i = postIndex; i < totalPosts-1;){
        postsList[i] = postsList[i+1];
        unchecked {++i;}
      }
      postsIds = postsList;
      postsIds.pop();
    }

    function fetchPosts() public view returns (Post[] memory posts, uint256, uint256, address) {

      uint256 postsLength = postsIds.length;
      uint256[] memory postArray = postsIds;
      posts = new Post[](postsLength);

      for (uint i = 0; i < postsLength;) {
        posts[i] = postByTokenId[postArray[i]];
        unchecked {++i;}
      }

      return (posts, postsCounter, commentsCounter, admin);
    }

    //COMMENTS FUNCTIONS
    function createComment(uint256 _tokenId, string calldata _cid) public {

      Comment memory comment = Comment({
        cid: _cid,
        commentor: msg.sender,
        id: ++commentsCounter
      });
      postByTokenId[_tokenId].comments.push(comment);
    }

    function _postCommentor(uint256 _tokenId, uint256 _commentId) internal view returns(address commentor) {

      for(uint i = 0; i < postByTokenId[_tokenId].comments.length;) {
        if(postByTokenId[_tokenId].comments[i].id == _commentId) {
          commentor = postByTokenId[_tokenId].comments[i].commentor;
          break;
        }
        unchecked {++i;}
      }
      return commentor;
    }

    //cant pop structs so have to build new array of structs without the value to delete
    //this function is really unoptimized but it works in the meantime copyof opcode is introduced
    function removeComment(uint256 _tokenId, uint256 _commentId) public {
      require(postByTokenId[_tokenId].author == msg.sender ||
       _postCommentor(_tokenId,_commentId) == msg.sender ||
       admin == msg.sender,
       'Only post author or commentor can remove comment');

       Comment[] memory comments = postByTokenId[_tokenId].comments;
       uint256 totalComments = comments.length;

      if(totalComments == 1){
        postByTokenId[_tokenId].comments = emptyCommentsArr;
      } else {

        tempCommentsArr = emptyCommentsArr;
        for (uint256 i = 0; i < totalComments;) {
          if (comments[i].id != _commentId) {
            tempCommentsArr.push(postByTokenId[_tokenId].comments[i]);
          }
          unchecked {++i;}
        }
        postByTokenId[_tokenId].comments = tempCommentsArr;
      }
    }

    function fetchComments(uint256 _tokenId) public view returns (Comment[] memory comments) {

      uint256 commentsLength = postByTokenId[_tokenId].comments.length;
      Comment[] memory commentArray = postByTokenId[_tokenId].comments;
      comments = new Comment[](commentsLength);

      for (uint i = 0; i < commentsLength;) {
        comments[i] = commentArray[i];
        unchecked {++i;}
      }

      return comments;
    }

    //LIKES FUNCTION
    function like(uint256 _tokenId) public {

      address[] memory likesList = postByTokenId[_tokenId].likes;
      uint totalLikes = likesList.length;
      bool hasLiked = false;
      uint256 likeIndex = 0;
      for(uint i = 0; i < totalLikes;) {
        if(postByTokenId[_tokenId].likes[i] == msg.sender) {
          hasLiked = true;
          likeIndex = i;
          break;
        }
        unchecked {++i;}
      }

      //if like index is 0 then add msg.sender to likes array
      if(!hasLiked){
        postByTokenId[_tokenId].likes.push(msg.sender);
      } else {
        //if like index is not 0 then remove msg.sender from likes array
        for(uint i = likeIndex; i < totalLikes-1;) {
          likesList[i] = likesList[i+1];
          unchecked {++i;}
        }
        postByTokenId[_tokenId].likes = likesList;
        postByTokenId[_tokenId].likes.pop();
      }
    }

    function fetchLikes(uint256 _tokenId) public view returns (address[] memory likes) {
      likes = postByTokenId[_tokenId].likes;
      return likes;
    }

    //ADMIN FUNCTION
    function changeAdmin(address _newAdmin) public onlyAdmin {
      admin = _newAdmin;
    }

}
