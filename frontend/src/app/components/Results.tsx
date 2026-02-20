import { Card, CardContent, CardHeader } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { results } from "../../data/mockdata.ts";

export default function Results() {
	return (
		<Card className="mb-8">
			<CardHeader>
				<CardHeader>Full Results</CardHeader>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHead>
						<TableRow className={"font-bold"}>
							<TableCell className="w-20">Position</TableCell>
							<TableCell>Runner Name</TableCell>
							<TableCell>Time</TableCell>
							<TableCell>Age Group</TableCell>
							<TableCell>Gender</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{results.map((result) => (
							<TableRow key={result.id}>
								<TableCell>#{result.position}</TableCell>
								<TableCell>{result.runnerName}</TableCell>
								<TableCell>{result.time}</TableCell>
								<TableCell>{result.ageGroup}</TableCell>
								<TableCell>{result.gender}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
