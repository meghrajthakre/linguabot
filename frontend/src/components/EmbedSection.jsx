import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const EmbedSection = ({ bot }) => {
    const [copied, setCopied] = useState(false);

    const embedCode = `
<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey}"
  };
</script>
<script src="http://localhost:4000/widget.js"></script>
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">

            <div>
                <p className="text-xs text-gray-500 mb-1">Public Key</p>
                <div className="flex items-center justify-between bg-white border rounded px-3 py-2">
                    <span className="text-sm font-mono truncate">
                        {bot.publicKey}
                    </span>
                </div>
            </div>

            <div>
                <p className="text-xs text-gray-500 mb-1">Embed Code</p>
                <div className="relative">
                    <pre className="text-xs bg-white border rounded p-3 overflow-x-auto">
                        {embedCode}
                    </pre>

                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-yellow-600 transition"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            </div>

            <div className="text-xs text-gray-500">
                Add this code before your website’s <strong>&lt;/body&gt;</strong> tag.
            </div>

        </div>
    );
};

export default EmbedSection;