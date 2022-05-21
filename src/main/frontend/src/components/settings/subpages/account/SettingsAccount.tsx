import React, {useState} from 'react';
import Section from "../../components/SettingsContentSection";
import classes from "./SettingsAccount.module.css";
import {useCacheStore} from "../../../../context/CacheStore/CacheStoreContext";
import AccountFormPopup, {ValidationPopupType} from "./AccountFormPopup";

const SettingsAccount = () => {
    const cacheStore = useCacheStore()!;
    const [userState] = cacheStore.userReducer;

    const [popupShown, setPopupShown] = useState(false);
    const [popupType, setPopupType] = useState<ValidationPopupType>(ValidationPopupType.DELETE_ACCOUNT);

    return (
        <div>
            <form>
                <Section title={"Change username"}>
                    <p className={classes.text}>Current username: <b>{userState.username}</b></p>
                    <button className={classes.button} onClick={() => {
                        setPopupType(ValidationPopupType.CHANGE_USERNAME);
                        setPopupShown(true)
                    }} type={"button"}>Change
                    </button>
                </Section>
                <Section title={"Change email"}>
                    <p className={classes.text}>Current email: <b>{userState.email}</b></p>
                    <button className={classes.button} onClick={() => {
                        setPopupType(ValidationPopupType.CHANGE_EMAIL);
                        setPopupShown(true);
                    }} type={"button"}>Change
                    </button>
                </Section>
                <Section title={"Delete account"}>
                    <button className={classes.delete} type={"button"} onClick={() => {
                        setPopupShown(true);
                        setPopupType(ValidationPopupType.DELETE_ACCOUNT);
                    }}>Delete your account
                    </button>
                </Section>
            </form>

            <AccountFormPopup type={popupType} shown={popupShown} setShown={setPopupShown}></AccountFormPopup>
        </div>
    );
};

export default SettingsAccount;