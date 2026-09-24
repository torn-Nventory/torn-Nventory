import {
    Button,
    Card,
    Description,
    FieldError,
    Form,
    Input,
    TextField,
    toast
} from "@heroui/react";
import { Check } from "@gravity-ui/icons";
import { Link } from "react-router-dom";
import { useApp } from "@/context";

export default function ApiCard() {
    const { apiKey, keyInfo, setApiKey, clearApiKey } = useApp();
    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);


        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });


        setApiKey(data.key);
        toast.success("API key set")
    };

    const onDelete = async () => {
        clearApiKey();
        toast.success("API key removed")

    };

    return (
        <Card className="w-full p-4">
            {/* Card Header  */}
            <Card.Header className="flex flex-row justify-between items-start gap-4 text-xl ">
                API Key
            </Card.Header>

            {/* Card Body with Bio / Description */}
            <Card.Content className="py-3 text-small text-default-500">
                <div className="flex gap-4 justify-between">
                    <span className="flex gap-2 border p-2 rounded-xl">
                        <p className="text-default-500 text-small">Key:</p>
                        <p className="font-semibold text-default-700 text-small">{apiKey || "Not Set"}</p>
                    </span>
                    <div className="flex gap-2 border p-2 rounded-xl">
                        <p className="text-default-500 text-small">Access:</p>
                        <p className="font-semibold text-default-700 text-small">{keyInfo?.access.type || "Not Set"}</p>
                    </div>
                </div>
                <Form
                    className="flex w-96 flex-col gap-4 mt-4 w-full"
                    render={(props) => <form {...props} data-custom="foo" />}
                    onSubmit={onSubmit}
                >
                    <TextField
                        aria-label="API Key"
                        isRequired
                        minLength={8}
                        name="key"
                        type="text"
                        defaultValue={apiKey || ""}
                    >
                        <Description className="p-2">
                            <span>
                                This tool needs a limited key, You can get your API key from{'  '}
                            </span>
                            <Link className="font-semibold text-blue-700 text-base" to="https://www.torn.com/preferences.php#tab=api?&step=addNewKey&title=torn-nventory.github.io&type=3" target="_blank">
                                here
                            </Link>
                        </Description>
                        <div className="flex gap-2 justify-between">
                            <Input placeholder="Enter your API key" className="inline-flex grow-3" />
                            <Button type="submit" className="rounded-xl">
                                <Check />
                                Submit
                            </Button>
                        </div>

                        <FieldError />
                    </TextField>
                </Form>
                <div className="flex w-full gap-4 mt-4 justify-end">
                    <Button variant="danger" onClick={onDelete} className="rounded-xl">
                        Delete API Key
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
}
