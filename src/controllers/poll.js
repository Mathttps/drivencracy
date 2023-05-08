import dataBase from "../database/dataBase.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function pollCreateSurvey(req, res) {
    const survey = req.body;
    try {
        const expireAt = survey.expireAt || dayjs().add(1, "month").format("YYYY/MM/DD HH:mm");
        await dataBase.collection("polls").insertOne({ ...survey, expireAt });
        res.status(201).send("OK");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function pollCollectionSurvey(req, res) {
    const surveys = await dataBase.collection("polls").find().toArray();
    res.send(surveys);
}

export async function pollIdChoice(req, res) {
    const pollId = req.params.id;
    try {
        const survey = await dataBase.collection("polls").findOne({ _id: ObjectId(pollId) });
        if (!survey) return res.status(404).send("Enquete não existe");
        const choices = await dataBase.collection("choices").find({ pollId: ObjectId(pollId) }).toArray();
        res.send(choices);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function pollIdResult(req, res) {
    const pollId = req.params.id;
    try {
        const survey = await dataBase.collection("polls").findOne({ _id: ObjectId(pollId) });
        if (!survey) return res.status(404).send("");
        const choices = await dataBase.collection("choices").find({ pollId: ObjectId(pollId) }).toArray();
        const votes = await Promise.all(choices.map(async (choice) => {
            const votesCount = await dataBase.collection("createChoices").countDocuments({ choiceId: choice._id });
            return { title: choice.title, votes: votesCount };
        }));
        const mostVotedChoice = votes.reduce((max, vote) => max.votes > vote.votes ? max : vote, { title: "", votes: -1 });
        res.send({
            ...survey,
            result: mostVotedChoice,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
