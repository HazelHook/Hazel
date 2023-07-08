import childProcess from "node:child_process"
import React, { useState } from "react"

import { Button } from "../components/button"
import { Checkbox } from "../components/checkbox"
import { CustomList } from "../components/custom-list"
import { Box, Text, useInput } from "../ext/ink"
import { useDataSources } from "../lib/datasource"
import { cap } from "../lib/util"

function truncate(datasource: string, cascade: boolean) {
	childProcess.exec(
		`tb --token ${process.env.TINY_TOKEN!} datasource truncate ${datasource} ${cascade ? "--cascade" : ""} --yes`,
	)
}

export function Purger({
	mode,
	selected,
	engaged,
	disengage,
}: {
	mode: "details" | "select"
	selected?: boolean
	engaged: boolean
	disengage: () => void
}) {
	const [datasources, setDatasources] = useDataSources()
	const [selectedCheckboxTab1, setSelectedCheckboxesTab1] = useState<number[]>([])
	const [selectedCheckboxTab2, setSelectedCheckboxesTab2] = useState<number[]>([])
	const [selectedOption, setSelectedOption] = useState(0)
	const [cascadeDelete, setCascadeDelete] = useState(false)
	const [tabIndex, setTabIndex] = useState(0)
	const elementCount = (datasources.datasources?.length ?? 0) + 2
	const tables = {} // { connections: connection, destinations: destination, sources: source }
	const tablesCount = Object.keys(tables).length

	useInput((input, key) => {
		if (engaged) {
			if (key.leftArrow) {
				if (tabIndex === 0 || selectedOption > tablesCount) {
					disengage()
				} else if (tabIndex === 1) {
					setTabIndex(0)

					if (selectedOption >= datasources.datasources.length) {
						setSelectedOption(datasources.datasources.length - 1)
					}
				}
			}

			if (key.rightArrow) {
				if (tabIndex === 0) {
					setTabIndex(1)

					if (selectedOption >= tablesCount) {
						setSelectedOption(tablesCount - 1)
					}
				}
			}
		}
	})

	if (mode === "details") {
		if (!selected) return null

		return (
			<Box display="flex" flexDirection="column" gap={1}>
				<Box display="flex" gap={15}>
					<CustomList
						config={{
							color: "white",
							selectedColor: "green",
						}}
						items={datasources.datasources?.map((ds) => ds.name)}
						type="checkbox"
						title="Datasources"
						engaged={engaged && tabIndex === 0}
						selectedIndex={selectedOption}
						setSelectedIndex={(index) => {
							setSelectedOption(cap(0, elementCount - 1, index))
						}}
						setSelectedCheckboxes={setSelectedCheckboxesTab1}
					/>
					<CustomList
						config={{
							color: "white",
							selectedColor: "green",
						}}
						title="Database Tables"
						items={Object.keys(tables)}
						type="checkbox"
						engaged={engaged && tabIndex === 1}
						selectedIndex={selectedOption}
						setSelectedIndex={(index) => {
							if (index >= tablesCount && index < elementCount - 1) {
								setSelectedOption(elementCount - 2)
								setTabIndex(0)
							} else {
								setSelectedOption(cap(0, elementCount - 1, index))
							}
						}}
						setSelectedCheckboxes={setSelectedCheckboxesTab2}
					/>
				</Box>
				<Box display="flex" flexDirection="column">
					<Checkbox
						color="white"
						selectedColor="green"
						selected={cascadeDelete}
						highlighted={engaged && selectedOption === elementCount - 2}
						label="Cacade Delete"
						onToggle={setCascadeDelete}
					/>
					<Button
						name="Purge Datasources"
						selected={selectedOption === elementCount - 1 && engaged}
						onClick={async () => {
							console.log(selectedCheckboxTab1)
							for (const index of selectedCheckboxTab1) {
								if (index < datasources.datasources.length) truncate(datasources.datasources[index].name, cascadeDelete)
							}

							for (const index of selectedCheckboxTab2) {
								if (index < tablesCount) {
									await datasources.db.delete(tables[Object.keys(tables)[index]])
								}
							}
						}}
					/>
				</Box>
			</Box>
		)
	} else if (mode === "select") {
		if (selected) {
			return (
				<Text bold color="#CC671B" dimColor={engaged}>
					{">"} Data Purger
				</Text>
			)
		}
		return (
			<Text color="#CC671B" dimColor>
				{" "}
				Data Purger
			</Text>
		)
	}
}
