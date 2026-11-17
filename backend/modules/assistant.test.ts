// Fakes. Names start with "mock" so jest.mock is allowed to use them.
const mockCreate = jest.fn();
const mockExecuteTool = jest.fn();

jest.mock("groq-sdk", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: { completions: { create: (...args: unknown[]) => mockCreate(...args) } },
  })),
}));

jest.mock("./assistantTools", () => ({
  tools: [],
  executeTool: (...args: unknown[]) => mockExecuteTool(...args),
}));

import { askAssistant } from "./assistant";

// Two helpers that build the shape of a Groq reply
const finalAnswer = (content: string) => ({
  choices: [{ finish_reason: "stop", message: { content } }],
});

const toolRequest = (args: string) => ({
  choices: [
    {
      finish_reason: "tool_calls",
      message: {
        content: null,
        tool_calls: [{ id: "call_1", type: "function", function: { name: "search_catalog", arguments: args } }],
      },
    },
  ],
});

beforeEach(() => {
  mockCreate.mockReset();
  mockExecuteTool.mockReset();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("askAssistant", () => {
  it("returns the model's answer when it needs no tool", async () => {
    mockCreate.mockResolvedValueOnce(finalAnswer("Bonjour !"));

    expect(await askAssistant("Salut")).toBe("Bonjour !");
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockExecuteTool).not.toHaveBeenCalled();
  });

  it("runs the requested tool, sends the result back, and returns the final answer", async () => {
    mockExecuteTool.mockResolvedValue([{ title: "Arsène Lupin" }]);
    mockCreate
      .mockResolvedValueOnce(toolRequest('{"query":"polar"}'))
      .mockResolvedValueOnce(finalAnswer("Je vous conseille Arsène Lupin."));

    expect(await askAssistant("Un polar ?")).toBe("Je vous conseille Arsène Lupin.");

    expect(mockExecuteTool).toHaveBeenCalledWith("search_catalog", { query: "polar" });
    const sentBack = mockCreate.mock.calls[1][0].messages.at(-1);
    expect(sentBack).toEqual({
      role: "tool",
      tool_call_id: "call_1",
      content: JSON.stringify([{ title: "Arsène Lupin" }]),
    });
  });

  it("turns broken tool arguments into an error message instead of crashing", async () => {
    mockCreate
      .mockResolvedValueOnce(toolRequest("not json"))
      .mockResolvedValueOnce(finalAnswer("Désolé, pouvez-vous reformuler ?"));

    await askAssistant("Un polar ?");

    expect(mockExecuteTool).not.toHaveBeenCalled();
    expect(mockCreate.mock.calls[1][0].messages.at(-1).content).toBe("Error: invalid tool input");
  });

  it("returns the fallback when the answer is cut off", async () => {
    mockCreate.mockResolvedValueOnce({ choices: [{ finish_reason: "length", message: { content: "Voici" } }] });

    expect(await askAssistant("Salut")).toContain("Désolé");
  });

  it("stops after 5 iterations if the model keeps asking for tools", async () => {
    mockExecuteTool.mockResolvedValue([]);
    mockCreate.mockResolvedValue(toolRequest('{"query":"x"}'));

    expect(await askAssistant("Salut")).toContain("Désolé");
    expect(mockCreate).toHaveBeenCalledTimes(5);
  });
});
