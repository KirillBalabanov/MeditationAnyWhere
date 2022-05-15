import React from 'react';
import Section from "../../components/SettingsContentSection";
import {useAuthContext} from "../../../../context/AuthContext";
import classes from "./SettingsAccount.module.css";

const SettingsAccount = () => {
    const authContext = useAuthContext()!;

    return (
        <div>
            <Section title={"Change username"}>
                <p className={classes.text}>Current username: <b>{authContext?.username}</b></p>
                <input type="text" placeholder="Enter new username" className={classes.input}/>
                <button className={classes.button}>Change</button>
            </Section>
            <Section title={"Change email"}>
                <p className={classes.text}>Current email: <b>Email</b></p>
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