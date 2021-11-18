import { MdAdd } from "react-icons/md";
import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function ProvideComponent(props) {
    const [amountOfTitan, setAmountOfTitan] = useState(0);
    const [amountOfTitanplus, setAmountOfTitanplus] = useState(0);
    const [error, setError] = useState("");

    // Gets estimates of a token to be provided in the pool given the amount of other token
    const getProvideEstimate = async (token, value) => {
        if (["", "."].includes(value)) return;
        if (props.contract !== null) {
            try {
                let estimate;
                if (token === "TITAN") {
                    estimate = await props.contract.getEquivalentToken2Estimate(
                        value * PRECISION
                    );
                    setAmountOfTitanplus(estimate / PRECISION);
                } else {
                    estimate = await props.contract.getEquivalentToken1Estimate(
                        value * PRECISION
                    );
                    setAmountOfTitan(estimate / PRECISION);
                }
            } catch (err) {
                if (err?.data?.message?.includes("Zero Liquidity")) {
                    setError("Message: Empty pool. Set the initial conversion rate.");
                } else {
                    //alert(err?.data?.message);
                }
            }
        }
    };

    const onChangeAmountOfTitan = (e) => {
        setAmountOfTitan(e.target.value);
        getProvideEstimate("TITAN", e.target.value);
    };

    const onChangeAmountOfTitanplus = (e) => {
        setAmountOfTitanplus(e.target.value);
        getProvideEstimate("TITANPLUS", e.target.value);
    };

    // Adds liquidity to the pool
    const provide = async () => {
        if (["", "."].includes(amountOfTitan) || ["", "."].includes(amountOfTitanplus)) {
            alert("Amount should be a valid number");
            return;
        }
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        } else {
            try {
                let response = await props.contract.provide(
                    amountOfTitan * PRECISION,
                    amountOfTitanplus * PRECISION
                );
                await response.wait();
                setAmountOfTitan(0);
                setAmountOfTitanplus(0);
                await props.getHoldings();
                alert("Success");
                setError("");
            } catch (err) {
                err && alert(err?.data?.message);
            }
        }
    };

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of TITAN"}
                value={amountOfTitan}
                onChange={(e) => onChangeAmountOfTitan(e)}
            />
            <div className="swapIcon">
                <MdAdd />
            </div>
            <BoxTemplate
                leftHeader={"Amount of TITANPLUS"}
                value={amountOfTitanplus}
                onChange={(e) => onChangeAmountOfTitanplus(e)}
            />
            <div className="error">{error}</div>
            <div className="bottomDiv">
                <div className="btn" onClick={() => provide()}>
                    Provide
                </div>
            </div>
        </div>
    );
}
