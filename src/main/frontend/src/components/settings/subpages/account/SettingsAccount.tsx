import React from 'react';
import Section from "../../components/SettingsContentSection";
import classes from "./SettingsAccount.module.css";
import {useCacheStore} from "../../../../context/CacheStore/CacheStoreContext";

const SettingsAccount = () => {
    const cacheStore = useCacheStore()!;
    const [userState] = cacheStore.userReducer;

    return (
        <div>
            <Section title={"Change username"}>
                <p className={classes.text}>Current username: <b>{userState.username}</b></p>
                <input type="text" placeholder="Enter new username" className={classes.input}/>
                <button className={classes.button}>Change</button>
            </Section>
            <Section title={"Change email"}>
                <p className={classes.text}>Current email: <b>{userState.email}</b></p>
                <input type="text" placeholder="Enter new email" className={classes.input}/>
                <button className={classes.button}>Change</button>
            </Section>
            <Section title={"Delete account"}>
                <button className={classes.delete}>Delete your account</button>
            </Section>
        </div>
    );
};

export default SettingsAccount;