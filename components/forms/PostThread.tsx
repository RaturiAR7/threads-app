"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import Thread from "@/lib/models/thread.model";
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import natural from "natural";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathName = usePathname();

  const [model, setModel] = useState(null);
  const [predictionLoad, setPredictionLoad] = useState(false);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading model...");
        const loadedModel = await tf.loadLayersModel(
          "/toxicityModel/model.json"
        );
        setModel(loadedModel);
        console.log("Model loaded successfully:", loadedModel);
      } catch (error) {
        console.error("Error loading the model:", error);
      }
    };
    // Load the model when the component mounts
    console.log("Loading model");
    loadModel();
  }, []);

  // Tokenize and pad function
  function tokenizeAndPad(text, vocab, maxLength) {
    // Tokenize: Split text by whitespace and map to vocabulary indices
    const tokens = text
      .toLowerCase()
      .split(/\s+/)
      .map((word) => vocab[word] || vocab["0"]); // Map words to indices, default to vocab["0"] if not found

    // Pad or truncate the sequence to maxLength
    const paddedTokens = tokens
      .slice(0, maxLength)
      .concat(Array(Math.max(maxLength - tokens.length, 0)).fill(vocab["0"])); // Pad with vocab["0"]

    return paddedTokens;
  }

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    predict(values.thread);
    // await createThread({
    //   text: values.thread,
    //   author: userId,
    //   path: pathName,
    // });
    // router.push("/");
  };
  const loadVocabulary = async () => {
    const response = await fetch("/vocabulary.json");
    const vocab = await response.json();
    console.log(vocab);
    return vocab;
  };

  // Reshape and predict function
  async function predict(text: string) {
    if (!model) {
      console.error("Model not loaded.");
      return;
    }
    const vocab = await loadVocabulary();

    // Tokenize, pad, and create a tensor
    const maxLength = 1800;
    const tokenizedText = tokenizeAndPad(text, vocab, maxLength);

    if (tokenizedText.length !== maxLength) {
      console.error(
        `Tokenized text length is ${tokenizedText.length}, but expected ${maxLength}.`
      );
      return;
    }

    const inputTensor = tf.tensor2d([tokenizedText], [1, maxLength]); // Shape [1, 1800]

    // Make prediction
    const prediction = model.predict(inputTensor);

    // Convert tensor to array
    const predictionArray = await prediction.array();
    console.log("Prediction:", predictionArray);

    return predictionArray;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col mt-10 justify-start gap-10'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
