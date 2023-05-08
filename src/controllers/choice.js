import dataBase from "../database/dataBase.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function choicePoll(req, res) {
    const choice = req.body;

    try {
        const survey = await dataBase.collection("polls").findOne({ _id: ObjectId(choice.pollId) });
        if (!survey) return res.status(404).send("Uma opção de voto não pode ser inserida sem uma enquete existente.");

        const existingChoice = await dataBase.collection("choices").findOne({ title: choice.title });
        if (existingChoice) return res.status(409).send("Title não pode ser repetido.");

        if (dayjs(survey.expireAt) < dayjs()) return res.status(403).send("Enquete expirada.");

        await dataBase.collection("choices").insertOne({ title: choice.title, pollId: ObjectId(choice.pollId) });

        res.status(201).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while creating the choice.");
    }
}

export async function choicePollId(req, res) {
    const choiceId = req.params.id;

    try {
        const choice = await dataBase.collection("choices").findOne({ _id: ObjectId(choiceId) });
        if (!choice) return res.status(404).send("The choice does not exist.");

        const survey = await dataBase.collection("polls").findOne({ _id: ObjectId(choice.pollId) });
        if (dayjs(survey.expireAt) < dayjs()) return res.status(409).send("The survey has ended.");

        await dataBase.collection("createChoices").insertOne({ createdAt: dayjs().toISOString(), choiceId: ObjectId(choiceId) });

        res.status(201).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("error.");
    }
}
