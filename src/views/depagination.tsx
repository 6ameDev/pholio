import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Meth from '../utils/meth';
import Platform from '../models/platforms/platform';

type Position = "first" | "last" | "common";

function generateStepContent(position: Position, step: number, platform: string) {
  const nextStep = step + 1;
  const contentMap = {
    "first": {
      label: `Starting aggregation. Navigate to Page ${nextStep}`,
      description: `${platform}'s transaction history is paginated. In presence of any date
                    range selector on ${platform}'s website, select the starting date from the
                    beginning of all transactions or a date older to last exported transaction's
                    date. Once the transactions load, keep navigating to the next page.`
    },
    "common": {
      label: `Navigate to Page ${nextStep}`,
      description: `on ${platform}'s website, navigate to page ${nextStep}.`,
    },
    "last": {
      label: "Last Page",
      description: "",
    }
  }
  return contentMap[position];
}

export interface DepaginationProps {
  page: number;
  totalPages: number;
  platform: Platform;
}

export default function Depagination({ props }: { props: DepaginationProps }) {
  const { page, totalPages, platform } = props;

  const [activeStep, setActiveStep] = React.useState(page-1);

  useEffect(
    () => {
      if (activeStep !== (page-1)) {
        setActiveStep(page-1);
      }
    },
    [page]
  );

  function getStepContent(step: number, steps: number) {
    const platformName = platform.name();
    if (step === 1) return generateStepContent("first", step, platformName);
    if (step === steps) return generateStepContent("last", step, platformName);
    return generateStepContent("common", step, platformName);
  }

  const steps = totalPages;
  const stepsArr = Meth.sequence(1, steps);

  return (
    <Box sx={{ maxWidth: 600 }}>
      {totalPages && (
        <Stepper activeStep={activeStep} orientation="vertical">
          {stepsArr.map((step, index) => (
            <Step key={index}>
              <StepLabel>{getStepContent(step, steps).label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(step, steps).description}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      )}
    </Box>
  );
}
