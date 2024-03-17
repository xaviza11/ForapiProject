import seedrandom from 'seedrandom';

export default function secretPassGen(token: string, email: string): number {
    const numbers: number[] = [17, 6, 2, 18, 20, -6, -1, -11, -13, -18];
    const randomIndex: number = Math.floor(Math.random() * numbers.length);

    const semilla: string = email;
    const rng = seedrandom(semilla);
    const rng2 = seedrandom(token);
    const randomNumber: number = rng();
    const randomNumber2: number = rng2();

    const day: number = 12 * 0.013 - 100 + numbers[randomIndex];
    const month: number = 2 + 1 * day * 0.3 - numbers[randomIndex];
    const year: number = 2023 - 4 * month - day - numbers[randomIndex];

    const roundedValues: number = day / month + year * 3 * randomNumber + randomNumber2 * numbers[randomIndex];

    const result: number = parseFloat(roundedValues.toFixed(6));

    return result;
}
