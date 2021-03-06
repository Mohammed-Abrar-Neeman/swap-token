import { useEffect, useState } from "react";
import "../styles.css";
import SwapComponent from "./SwapComponent";
import ProvideComponent from "./ProvideComponent";
import WithdrawComponent from "./WithdrawComponent";
import FaucetComponent from "./FaucetComponent";
import { PRECISION } from "../constants";

export default function ContainerComponent(props) {
    const [activeTab, setActiveTab] = useState("Swap");
    const [amountOfTITAN, setAmountOfTITAN] = useState(0);
    const [amountOfTITANPLUS, setAmountOfTITANPLUS] = useState(0);
    const [amountOfShare, setAmountOfShare] = useState(0);
    const [totalTITAN, setTotalTITAN] = useState(0);
    const [totalTITANPLUS, setTotalTITANPLUS] = useState(0);
    const [totalShare, setTotalShare] = useState(0);

    useEffect(() => {
        getHoldings();
    });

    // Fetch the pool details and personal assets details.
    async function getHoldings() {
        try {
            console.log("Fetching holdings----");
            let response = await props.contract.getMyHoldings();
            setAmountOfTITAN(response.amountToken1 / PRECISION);
            setAmountOfTITANPLUS(response.amountToken2 / PRECISION);
            setAmountOfShare(response.myShare / PRECISION);

            response = await props.contract.getPoolDetails();
            setTotalTITAN(response[0] / PRECISION);
            setTotalTITANPLUS(response[1] / PRECISION);
            setTotalShare(response[2] / PRECISION);
        } catch (err) {
            console.log("Couldn't Fetch holdings", err);
        }
    }

    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="centerBody">
            <div className="centerContainer">
                <div className="selectTab">
                    <div
                        className={"tabStyle " + (activeTab === "Swap" ? "activeTab" : "")}
                        onClick={() => changeTab("Swap")}
                    >
                        Swap
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Provide" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Provide")}
                    >
                        Provide
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Withdraw" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Withdraw")}
                    >
                        Withdraw
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Faucet" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Faucet")}
                    >
                        Faucet
                    </div>
                </div>

                {activeTab === "Swap" && (
                    <SwapComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                    />
                )}
                {activeTab === "Provide" && (
                    <ProvideComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                    />
                )}
                {activeTab === "Withdraw" && (
                    <WithdrawComponent
                        contract={props.contract}
                        maxShare={amountOfShare}
                        getHoldings={() => getHoldings()}
                    />
                )}
                {activeTab === "Faucet" && (
                    <FaucetComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                    />
                )}
            </div>
            <div className="details">
                <div className="detailsBody">
                    <div className="detailsHeader">Details</div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Amount of TITAN:</div>
                        <div className="detailsValue">{amountOfTITAN}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Amount of TITANPLUS:</div>
                        <div className="detailsValue">{amountOfTITANPLUS}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Your Share:</div>
                        <div className="detailsValue">{amountOfShare}</div>
                    </div>
                    <div className="detailsHeader">Pool Details</div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total TITAN:</div>
                        <div className="detailsValue">{totalTITAN}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total TITANPLUS:</div>
                        <div className="detailsValue">{totalTITANPLUS}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total Shares:</div>
                        <div className="detailsValue">{totalShare}</div>
                </div>
                </div>
            </div>
        </div>
    );
}