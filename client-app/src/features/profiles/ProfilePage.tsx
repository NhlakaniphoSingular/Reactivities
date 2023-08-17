import { useEffect } from 'react';

import { Grid } from "semantic-ui-react";
import Profileheader from "./profileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponents";

export default observer(function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { profileStore } = useStore();
    const { loadingProfile, loadProfile, profile } = profileStore;


    useEffect(() => {
        if (username) loadProfile(username);
    }, [loadProfile, username])

    if (loadingProfile) return <LoadingComponent content="Loading profiles..." />

    return (

        <Grid>
            <Grid.Column width={16}>
                
                {profile && 
                <>
                <Profileheader profile ={profile} />
                <ProfileContent profile = {profile} />
                </>}
                
            </Grid.Column>
        </Grid>
    )
})