import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { boolean } from "yup";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;

    constructor() {
        makeAutoObservable(this)
    }
    get isCurrentUser() {
        if (store.userStore.user?.username && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }
    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false)
        }
    }
    uploadphoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file)
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo)
                    if (photo.ismain && store.userStore.user) {
                        store.userStore.setImage(photo.url)
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.uploading = false)
        }
    }
    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id)
            store.userStore.setImage(photo.url)
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.ismain)!.ismain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.ismain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.loading = false)
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if
                    (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id)
                    this.loading = false;
                }
            })


        } catch (error) {
            console.log(error)
            runInAction(() => this.loading = false)
        }
    }
    updateFollowing = async (username: string, Following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.UpdateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username) {
                    Following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following
                }
                this.followings.forEach(profile => {
                    if(profile.username === username){
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false)
        }
    }
}