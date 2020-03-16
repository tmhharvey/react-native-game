import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenOrientation } from "expo";
import NumberContainer from "../components/NumberContainer";
import Card from "../components/Card";
import DefaultStyles from "../constants/default-styles";
import MainButton from "../components/MainButton";
import BodyText from "../components/BodyText";

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const randomNum = Math.random() * (max - min) + min;

  if (randomNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return Math.round(randomNum);
  }
};

const renderListItem = (value, numOfRound) => {
  return (
    <View key={value} style={styles.listItem}>
      <BodyText style={styles.scrollText}>#{numOfRound}</BodyText>
      <BodyText style={styles.scrollText}>{value}</BodyText>
    </View>
  );
};

const GameScreen = props => {
  const initialGuess = generateRandomBetween(1, 100, props.userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPassGuesses] = useState([initialGuess]);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };
    Dimensions.addEventListener("change", updateLayout);

    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props;
  useEffect(() => {
    if (currentGuess === props.userChoice) {
      props.onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = direction => {
    if (
      (direction === "lower" && currentGuess < props.userChoice) ||
      (direction === "greater" && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", "You know that isn't correct...");
      return;
    }

    if (direction === "lower") {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }

    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );

    setCurrentGuess(nextNumber);

    setPassGuesses(curPastGuesses => {
      return [nextNumber, ...curPastGuesses];
    });
  };

  // if (Dimensions.get('window'.height > 600)) {
  //   return <View>...</View>
  // }

  if (availableDeviceHeight < 550) {
    return (
      <View style={styles.screen}>
        <Text style={DefaultStyles.bodyText}>Opponent's Guess</Text>
        <NumberContainer>{currentGuess}</NumberContainer>
        <View style={styles.controls}>
          {/* <Card style={Dimensions.get('window').height > 600 ? styles.buttonContainer : style.buttonContainerSmall}> */}
          <MainButton
            onPress={() => {
              nextGuessHandler("lower");
            }}
          >
            <Ionicons name="md-remove" size={24} color="white" />
          </MainButton>
          <MainButton
            onPress={() => {
              nextGuessHandler("greater");
            }}
          >
            <Ionicons name="md-add" size={24} color="white" />
          </MainButton>
        </View>
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={styles.list}>
            {pastGuesses.map((guess, index) => {
              return renderListItem(guess, pastGuesses.length - index);
            })}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.screen}>
        <Text style={DefaultStyles.bodyText}>Opponent's Guess</Text>
        <NumberContainer>{currentGuess}</NumberContainer>
        <Card style={styles.buttonContainer}>
          {/* <Card style={Dimensions.get('window').height > 600 ? styles.buttonContainer : style.buttonContainerSmall}> */}
          <MainButton
            onPress={() => {
              nextGuessHandler("lower");
            }}
          >
            <Ionicons name="md-remove" size={24} color="white" />
          </MainButton>
          <MainButton
            onPress={() => {
              nextGuessHandler("greater");
            }}
          >
            <Ionicons name="md-add" size={24} color="white" />
          </MainButton>
        </Card>
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={styles.list}>
            {pastGuesses.map((guess, index) => {
              return renderListItem(guess, pastGuesses.length - index);
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center"
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Dimensions.get("window").height > 600 ? 20 : 10,
    width: 400,
    maxWidth: "90%"
  },
  listContainer: {
    width: Dimensions.get("window").width > 350 ? "60%" : "80%"
  },

  list: {
    // alignItems: 'center'
  },

  listItem: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  scrollText: {
    color: "black",
    fontSize: 20
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%"
  }
});
export default GameScreen;
