import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const starImages = [
  require("../../assets/red_star.png"),
  require("../../assets/blue_star.png"),
  require("../../assets/green_star.png"),
  require("../../assets/orange_star.png"),
  require("../../assets/purple_star.png"),
];

const ROWS = 9;
const COLS = 9;

export default function App() {
  const [stars, setStars] = useState<{ row: number; col: number; image: any }[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const handleStart = () => {
    if (gameOver) return;

    // tüm hücreleri hesapla
    const allPositions = Array.from({ length: ROWS * COLS }, (_, i) => {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      return `${row},${col}`;
    });

    // dolu hücreler
    const occupied = new Set(stars.map(s => `${s.row},${s.col}`));

    // boş hücreler
    const emptyPositions = allPositions.filter(p => !occupied.has(p));

    if (emptyPositions.length < 3) {
      setGameOver(true);
      return;
    }

    const newStars = [...stars];
    const used = new Set<string>();

    while (used.size < 3) {
      const randIdx = Math.floor(Math.random() * emptyPositions.length);
      const pos = emptyPositions[randIdx];
      if (used.has(pos)) continue;

      used.add(pos);
      const [row, col] = pos.split(",").map(Number);
      const image = starImages[Math.floor(Math.random() * starImages.length)];
      newStars.push({ row, col, image });
    }

    setStars(newStars);
  };

  const getStarImage = (row: number, col: number) => {
    const star = stars.find(s => s.row === row && s.col === col);
    return star ? <Image source={star.image} style={styles.image} /> : null;
  };

  return (
    <View style={styles.container}>
      {gameOver && <Text style={styles.gameOver}>Game Over!</Text>}

      <View style={styles.grid}>
        {Array.from({ length: ROWS }).map((_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: COLS }).map((_, col) => (
              <TouchableOpacity
                key={col}
                style={styles.button}
                onPress={() => console.log(`Tıklanan hücre: ${row}, ${col}`)}
              >
                {getStarImage(row, col)}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {!gameOver && (
        <Pressable style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startText}>Start</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 160,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  button: {
    width: 35,
    height: 35,
    margin: 2,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  startButton: {
    marginTop: 30,
    backgroundColor: "#4682B4",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  gameOver: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 20,
  },
});
