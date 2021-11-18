import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function FaucetComponent(props) {
    const [amountOfTitan, setAmountOfTitan] = useState(0);
    const [amountOfTitanplus, setAmountOfTitanplus] = useState(0);

    const onChangeAmountOfTitanplus = (e) => {
        setAmountOfTitanplus(e.target.value);
    };

    const onChangeAmountOfTitan = (e) => {
        setAmountOfTitan(e.target.value);
    };
	
    // Funds the account with given amount of Tokens 
    async function onClickFund() {
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        }
        if (["", "."].includes(amountOfTitan) || ["", "."].includes(amountOfTitanplus)) {
            alert("Amount should be a valid number");
            return;
        }
        try {
            let response = await props.contract.faucet(
                amountOfTitan * PRECISION,
                amountOfTitanplus * PRECISION
            );
            let res = await response.wait();
            console.log("res", res);
            setAmountOfTitan(0);
            setAmountOfTitanplus(0);
            await props.getHoldings();
            alert("Success");
        } catch (err) {
            err?.data?.message && alert(err?.data?.message);
            console.log(err);
        }
    }

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of TITAN"}
                right={"TITAN"}
                value={amountOfTitan}
                onChange={(e) => onChangeAmountOfTitan(e)}
            />
            <BoxTemplate
                leftHeader={"Amount of TITANPLUS"}
                right={"TITANPLUS"}
                value={amountOfTitanplus}
                onChange={(e) => onChangeAmountOfTitanplus(e)}
            />
            <div className="bottomDiv">
                <div className="btn" onClick={() => onClickFund()}>
                    Fund
                </div>
            </div>
        </div>
    );
}
