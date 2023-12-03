export const components = {
	schemas: {
		Destination: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					format: "int64",
				},
				name: {
					type: "string",
				},
				workspaceId: {
					type: "string",
				},
				publicId: {
					type: "string",
				},
				createdAt: {
					type: "string",
					format: "date-time",
				},
				updatedAt: {
					type: "string",
					format: "date-time",
				},
				key: {
					type: "string",
				},
				url: {
					type: "string",
				},
				websocket_connection: {
					type: "boolean",
				},
			},
			required: [
				"id",
				"name",
				"workspaceId",
				"publicId",
				"createdAt",
				"updatedAt",
				"key",
				"url",
				"websocket_connection",
			],
		},
		Source: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					format: "int64",
				},
				name: {
					type: "string",
				},
				workspaceId: {
					type: "string",
				},
				publicId: {
					type: "string",
				},
				createdAt: {
					type: "string",
					format: "date-time",
				},
				updatedAt: {
					type: "string",
					format: "date-time",
				},
				key: {
					type: "string",
				},
				integrationId: {
					type: "integer",
					format: "int64",
					nullable: true,
				},
			},
			required: ["id", "name", "workspaceId", "publicId", "createdAt", "updatedAt", "key"],
		},
		Connection: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					format: "int64",
				},
				name: {
					type: "string",
				},
				workspaceId: {
					type: "string",
				},
				publicId: {
					type: "string",
				},
				enabled: {
					type: "boolean",
				},
				sourceId: {
					type: "string",
				},
				destinationId: {
					type: "string",
				},
				source: {
					$ref: "#/components/schemas/Source",
				},
				destination: {
					$ref: "#/components/schemas/Destination",
				},
				delay: {
					type: "integer",
					format: "int64",
					nullable: true,
				},
				retryCount: {
					type: "integer",
					format: "int32",
					nullable: true,
				},
				retryDelay: {
					type: "integer",
					format: "int32",
					nullable: true,
				},
				retryType: {
					type: "string",
					enum: ["fixed", "anotherType1", "anotherType2"],
					nullable: true,
				},
				fluxConfig: {
					type: "object",
				},
				createdAt: {
					type: "string",
					format: "date-time",
				},
				updatedAt: {
					type: "string",
					format: "date-time",
				},
			},
			required: [
				"id",
				"name",
				"workspaceId",
				"publicId",
				"enabled",
				"source",
				"sourceId",
				"destination",
				"destinationId",
				"createdAt",
				"updatedAt",
			],
		},
	},
}
