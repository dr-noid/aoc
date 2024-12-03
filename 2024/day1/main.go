package main

import (
	"flag"
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
)

var inputFile = flag.String("i", "", "input file")
var ver = flag.Int("part", 1, "part 1 or 2")

func parse(line string) (left int64, right int64, err error) {
	split := strings.Split(line, " ")
	left, err = strconv.ParseInt(split[0], 10, 64)
	if err != nil {
		return
	}
	right, err = strconv.ParseInt(split[len(split)-1], 10, 64)
	if err != nil {
		return
	}

	return
}

func parseInput(input string) ([]int, []int, error) {
	lines := strings.Split(input, "\n")
	leftNums := make([]int, 0)
	rightNums := make([]int, 0)

	for _, line := range lines {
		left, right, err := parse(line)
		if err != nil {
			return nil, nil, err
		}
		leftNums = append(leftNums, int(left))
		rightNums = append(rightNums, int(right))
	}

	return leftNums, rightNums, nil
}

func calcDiff(leftNums []int, rightNums []int) []int {
	diffs := make([]int, len(leftNums))
	for idx, _ := range leftNums {
		diff := leftNums[idx] - rightNums[idx]
		if diff < 0 {
			diffs = append(diffs, -diff)
		} else {
			diffs = append(diffs, diff)
		}
	}
	return diffs
}

func part1(leftNums, rightNums []int) {
	if len(leftNums) != len(rightNums) {
		panic("mismatched left and right arrays")
	}

	slices.SortFunc(leftNums, func(a int, b int) int {
		return a - b
	})
	slices.SortFunc(rightNums, func(a int, b int) int {
		return a - b
	})

	diffs := calcDiff(leftNums, rightNums)

	final := 0
	for _, diff := range diffs {
		final += diff
	}
	fmt.Println(final)
}

func findOccurences(x int, numsList []int) (occurences int) {
	for _, num := range numsList {
		if num == x {
			occurences += 1
		}
	}
	return
}

func part2(leftNums, rightNums []int) {
	similarityScore := 0
	for _, left := range leftNums {
		occurences := findOccurences(left, rightNums)
		similarityScore += occurences * left
	}
	fmt.Println(similarityScore)
}

func main() {
	flag.Parse()
	if *inputFile == "" {
		flag.Usage()
		return
	}

	file, err := os.ReadFile(*inputFile)
	if err != nil {
		panic(err)
	}

	leftNums, rightNums, err := parseInput(string(file))
	if err != nil {
		panic(err)
	}

	if *ver == 1 {
		part1(leftNums, rightNums)
		return
	} else {
		part2(leftNums, rightNums)
	}

}
