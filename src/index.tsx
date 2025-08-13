import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PurchaseProgram } from "./screens/PurchaseProgram/PurchaseProgram";
import {onRecalculatedDeal, onRecalculatedDealError, onRecalculatedGap, onRecalculatedGapError} from './hooks/useDynamicData';

// Define ErrorBoundary directly here
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("React error boundary caught:", error, info);
    }

    render() {
        return this.state.hasError ? <div>Something went wrong.</div> : this.props.children;
    }
}

window.handleDealResponse = (response: any) => {

    if ('success' === response.status || 'complete' === response.status) {
        onRecalculatedDeal();

    } else if ('error' === response.status) {
        onRecalculatedDealError(response);
    }
}

window.handleGapResponse = (response: any) => {

    if ('success' === response.status || 'complete' === response.status) {
        onRecalculatedGap();

    } else if ('error' === response.status) {
        onRecalculatedGapError(response);
    }
}

// Mount react app
const container = document.getElementById("root");

if (container && !container.hasAttribute("data-react-mounted")) {
    container.setAttribute("data-react-mounted", "true");
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <ErrorBoundary>
                <PurchaseProgram />
            </ErrorBoundary>
        </StrictMode>
    );
}
