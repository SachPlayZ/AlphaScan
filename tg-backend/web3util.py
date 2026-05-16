import json
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))


def get_abi(ticker: str):
    with open(f"{ticker}.json", "r") as f:
        abi = json.load(f)
    return abi


def og_balance(agent_address: str, agent_private_key: str):
    balance = w3.eth.get_balance(agent_address)
    return {
        "public_key": agent_address,
        "private_key": agent_private_key,
        "og_balance": balance / 10**18,
    }


def token_balance(agent_address: str, agent_private_key: str, token_ticker: str):
    token_ticker = token_ticker.upper()

    if token_ticker == "OG":
        balance = w3.eth.get_balance(agent_address) / 10**18
        return {
            "public_key": agent_address,
            "private_key": agent_private_key,
            "token_balance": balance,
            "token_ticker": token_ticker,
        }

    token_addresses = {
        "DEAL": os.getenv("DEAL_TOKEN_ADDRESS"),
        "ALT": os.getenv("ALT_TOKEN_ADDRESS"),
    }

    token_address = token_addresses.get(token_ticker)
    if not token_address:
        raise ValueError(f"No contract address found for token {token_ticker}")

    token_abi = get_abi(token_ticker)
    token_contract = w3.eth.contract(address=token_address, abi=token_abi)

    balance = token_contract.functions.balanceOf(agent_address).call()

    return {
        "public_key": agent_address,
        "private_key": agent_private_key,
        "token_balance": balance / 10**18,
        "token_ticker": token_ticker,
    }


def buy_token(agent_address: str, agent_private_key: str, token_ticker: str, amount_in_og: float):
    token_ticker = token_ticker.upper()

    token_addresses = {
        "DEAL": os.getenv("DEAL_TOKEN_ADDRESS"),
        "ALT": os.getenv("ALT_TOKEN_ADDRESS"),
    }

    token_address = token_addresses.get(token_ticker)
    if not token_address:
        raise ValueError(f"No contract address found for token {token_ticker}")

    token_abi = get_abi(token_ticker)
    token_contract = w3.eth.contract(address=token_address, abi=token_abi)

    nonce = w3.eth.get_transaction_count(agent_address)

    if token_ticker == "DEAL":
        gas_estimate = token_contract.functions.buy().estimate_gas(
            {"from": agent_address, "value": w3.to_wei(amount_in_og, "ether")}
        )
    else:
        gas_estimate = token_contract.functions.buyAiT().estimate_gas(
            {"from": agent_address, "value": w3.to_wei(amount_in_og, "ether")}
        )

    gas_with_buffer = int(gas_estimate * 1.1)

    if token_ticker == "DEAL":
        buy_txn = token_contract.functions.buy().build_transaction(
            {
                "from": agent_address,
                "value": w3.to_wei(amount_in_og, "ether"),
                "gas": gas_with_buffer,
                "gasPrice": w3.eth.gas_price,
                "nonce": nonce,
            }
        )
    else:
        buy_txn = token_contract.functions.buyAiT().build_transaction(
            {
                "from": agent_address,
                "value": w3.to_wei(amount_in_og, "ether"),
                "gas": gas_with_buffer,
                "gasPrice": w3.eth.gas_price,
                "nonce": nonce,
            }
        )

    signed_txn = w3.eth.account.sign_transaction(buy_txn, agent_private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return {
        "transaction_hash": tx_receipt["transactionHash"].hex(),
        "status": tx_receipt["status"],
        "gas_used": tx_receipt["gasUsed"],
        "token_ticker": token_ticker,
    }


def sell_token(agent_address: str, agent_private_key: str, token_ticker: str, amount_in_tokens: float):
    token_ticker = token_ticker.upper()

    token_addresses = {
        "DEAL": os.getenv("DEAL_TOKEN_ADDRESS"),
        "ALT": os.getenv("ALT_TOKEN_ADDRESS"),
    }

    token_address = token_addresses.get(token_ticker)
    if not token_address:
        raise ValueError(f"No contract address found for token {token_ticker}")

    token_abi = get_abi(token_ticker)
    token_contract = w3.eth.contract(address=token_address, abi=token_abi)

    amount_in_wei = w3.to_wei(amount_in_tokens, "ether")
    nonce = w3.eth.get_transaction_count(agent_address)

    approve_gas_estimate = token_contract.functions.approve(
        token_address, amount_in_wei
    ).estimate_gas({"from": agent_address})

    approve_txn = token_contract.functions.approve(
        token_address, amount_in_wei
    ).build_transaction(
        {
            "from": agent_address,
            "gas": int(approve_gas_estimate * 1.1),
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
        }
    )

    signed_approve_txn = w3.eth.account.sign_transaction(approve_txn, agent_private_key)
    approve_tx_hash = w3.eth.send_raw_transaction(signed_approve_txn.raw_transaction)
    approve_receipt = w3.eth.wait_for_transaction_receipt(approve_tx_hash)

    nonce = w3.eth.get_transaction_count(agent_address)

    sell_gas_estimate = token_contract.functions.sell(amount_in_wei).estimate_gas(
        {"from": agent_address}
    )

    sell_txn = token_contract.functions.sell(amount_in_wei).build_transaction(
        {
            "from": agent_address,
            "gas": int(sell_gas_estimate * 1.1),
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
        }
    )

    signed_sell_txn = w3.eth.account.sign_transaction(sell_txn, agent_private_key)
    sell_tx_hash = w3.eth.send_raw_transaction(signed_sell_txn.raw_transaction)
    sell_receipt = w3.eth.wait_for_transaction_receipt(sell_tx_hash)

    return {
        "approve_transaction_hash": approve_receipt["transactionHash"].hex(),
        "approve_status": approve_receipt["status"],
        "approve_gas_used": approve_receipt["gasUsed"],
        "sell_transaction_hash": sell_receipt["transactionHash"].hex(),
        "sell_status": sell_receipt["status"],
        "sell_gas_used": sell_receipt["gasUsed"],
        "token_ticker": token_ticker,
    }
