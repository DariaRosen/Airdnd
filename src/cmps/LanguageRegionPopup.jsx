import { useState } from "react";

export function LanguageRegionPopup({ onClose }) {
    const [activeTab, setActiveTab] = useState("language"); // "language" or "currency"

    return (
        <div className="language-region-popup">
            <div className="popup-header">
                <button
                    className={activeTab === "language" ? "active" : ""}
                    onClick={() => setActiveTab("language")}
                >
                    Language & Region
                </button>
                <button
                    className={activeTab === "currency" ? "active" : ""}
                    onClick={() => setActiveTab("currency")}
                >
                    Currency
                </button>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="popup-content">
                {activeTab === "language" && (
                    <div>
                        <p>Select Language and Region here</p>
                        {/* Add language/region options */}
                    </div>
                )}
                {activeTab === "currency" && (
                    <div>
                        <p>Select Currency here</p>
                        {/* Add currency options */}
                    </div>
                )}
            </div>
        </div>
    );
}
