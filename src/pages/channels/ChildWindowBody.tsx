import {useChannelClient} from "openfin-react-hooks";

const CHANNEL_NAME = "test";

export function CHILD_BODY_AS_HOOK_OPTION(): JSX.Element {
    const {client} = useChannelClient(CHANNEL_NAME);

    const close = () => {
        const application = fin.desktop.Application.getCurrent();

        application.getChildWindows(function (children) {
            children.forEach(async (childWindow) => {
                const currentWindow = await fin.Window.getCurrent();
                console.log("Showing child: " + childWindow.name);
                if (childWindow.name === currentWindow.identity.uuid) {
                    childWindow.close();
                }
            });
        });
    }

    return <div>
        <button onClick={async () => await client.dispatch('increment')}>
            Increment
        </button>
        <button onClick={async () => await client.dispatch('decrement')}>
            Decrement
        </button>
        <button onClick={() => close()}>
            close
        </button>
    </div>;
}