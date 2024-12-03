package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
	"strings"
)

var inputFile = flag.String("i", "./day2/input.txt", "input file")
var part = flag.Int("part", 1, "1 or 2")

func abs(i int) int {
	if i < 0 {
		return -i
	}
	return i
}

func part1(lines []string) {
	safeReports := 0
	for _, line := range lines {
		nums, err := parseLine(line)
		if err != nil {
			panic(err)
		}
		safe := isSafe(nums)
		if safe {
			safeReports += 1
		}
	}
	fmt.Println(safeReports)
}

func isSafe(nums []int) bool {
	if len(nums) == 0 {
		return true
	}

	increasing := false
	if nums[0]-nums[1] > 0 {
		increasing = true
	}

	prev := nums[0]
	for _, num := range nums[1:] {
		diff := num - prev

		if increasing && diff > 0 {
			return false
		}
		if !increasing && diff < 0 {
			return false
		}

		diff = abs(diff)
		if diff < 1 || diff > 3 {
			return false
		}

		prev = num
	}

	return true
}

func parseLine(line string) ([]int, error) {
	splits := strings.Split(line, " ")
	nums := make([]int, 0, len(splits))
	for _, split := range splits {
		num, err := strconv.Atoi(split)
		if err != nil {
			return nil, err
		}
		nums = append(nums, num)
	}
	return nums, nil
}

func main() {
	flag.Parse()
	if *inputFile == "" {
		flag.Usage()
		return
	}

	fileData, err := os.ReadFile(*inputFile)
	if err != nil {
		panic(err)
	}

	lines := strings.Split(string(fileData), "\n")

	if *part == 1 {
		part1(lines)
	} else {
	}
}
