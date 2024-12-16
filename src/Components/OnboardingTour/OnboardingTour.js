import React, { useEffect, useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const steps = [
    {
        content: <p>Hi there! Right now, this is demo info. Connect your wallet to load your actual data.</p>,
        locale: {
            skip: <strong aria-label="skip">Skip</strong>,
            next: <strong aria-label="next">Next</strong>
        },
        placement: 'center',
        target: 'body',
        title: 'Let’s explore ChainGlance!',
    },
    {
        target: '#summary.sidebar-item', // Add this ID or adjust to match the actual element in the app
        content: (
            <>
                <p>
                    Here you’ll see a summary of your connected wallets and total balance. Click any wallet to view
                    detailed transactions.
                </p>
            </>
        ),
        locale: { skip: 'Skip', next: 'Next' },
        title: "Summary Overview",
    },
    {
        target: '#nfts.sidebar-item', // Add this ID or adjust to match the actual element in the app
        content: (
            <>
                <p>
                    Check out your NFT collection here! See details on each digital asset you own, along with its
                    current market status.
                </p>
            </>
        ),
        locale: { skip: 'Skip', next: 'Next' },
        title: "NFTs",
    },
    {
        target: '#transactions.sidebar-item', // Add this ID or adjust to match the actual element in the app
        content: (
            <>
                <p>
                    Track all your incoming and outgoing transactions in one place. Click on any transaction for a full
                    breakdown.
                </p>
            </>
        ),
        locale: { skip: 'Skip', next: 'Next' },
        title: "Transactions",
    },

];

const OnboardingTour = () => {
    const [run, setRun] = useState(false); // Control if the tour should run
    const [stepIndex, setStepIndex] = useState(0);

    console.log("index", stepIndex);

    useEffect(() => {
        // Delay start until DOM is ready and elements exist
        const timer = setTimeout(() => {
            const allTargetsExist = steps.every((step) => document.querySelector(step.target));
            if (allTargetsExist) {
                console.log("will initiate tour");
                setRun(true);
            }
        }, 1000 * 1); // Adjust delay if necessary
        return () => clearTimeout(timer);
    }, []);


    const handleJoyrideCallback = (data) => {
        const { status, type } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {

            setRun(false);
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            run={run}
            // scrollOffset={64}
            // scrollToFirstStep
            showProgress
            disableScrolling
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    zIndex: 10000,
                },
                buttonNext: {
                    backgroundColor: `var(--primary)`,
                },
                buttonBack: {
                    color: `var(--primary)`,
                }
            }}
            locale={{
                skip: 'Skip',
                next: 'Next',
                back: 'Back',
                last: 'Finish',
            }}

        />
    );
};

export default OnboardingTour;