import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  getHistory,
  subscribe,
  HISTORY_WINDOW_MS,
} from './keyHistoryStore';
import {
  KEY_ANALOG_MIN,
  KEY_ANALOG_MAX,
} from '../../../shared/config/chartConfig';

type Props = {
  open: boolean;
  onClose: () => void;
  keyId: number;
  keyLabel: string;
};

const CHART_WIDTH = 640;
const CHART_HEIGHT = 280;
const PADDING_LEFT = 50;
const PADDING_RIGHT = 12;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 28;

const plotW = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
const plotH = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

const KeyAnalogChartDialog: React.FC<Props> = ({
  open,
  onClose,
  keyId,
  keyLabel,
}) => {
  const theme = useTheme();
  const [, forceTick] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    if (!open) return;
    const unsub = subscribe(keyId, () => forceTick());
    return unsub;
  }, [open, keyId]);

  const min = KEY_ANALOG_MIN;
  const max = KEY_ANALOG_MAX;
  const samples = getHistory(keyId, HISTORY_WINDOW_MS);
  const now = performance.now();
  const tMin = now - HISTORY_WINDOW_MS;

  const xOf = (t: number) =>
    PADDING_LEFT + ((t - tMin) / HISTORY_WINDOW_MS) * plotW;
  const yOf = (v: number) => {
    const span = max - min || 1;
    const clamped = Math.max(min, Math.min(max, v));
    return PADDING_TOP + plotH - ((clamped - min) / span) * plotH;
  };

  const latest = samples.length > 0 ? samples[samples.length - 1].v : null;

  let polyline = '';
  if (samples.length > 0) {
    polyline = samples
      .map((s) => `${xOf(s.t).toFixed(1)},${yOf(s.v).toFixed(1)}`)
      .join(' ');
  }

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = min + ((max - min) * i) / 4;
    return { v, y: yOf(v) };
  });

  const xTicks = Array.from({ length: 6 }, (_, i) => {
    const secondsAgo = 10 - i * 2;
    const t = now - secondsAgo * 1000;
    return { label: `-${secondsAgo}s`, x: xOf(t) };
  });

  const axisColor = theme.palette.text.secondary;
  const gridColor = theme.palette.divider;
  const lineColor = theme.palette.primary.main;
  const fillColor = theme.palette.primary.main + '33';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          Analog history — <b>{keyLabel}</b>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Last 10 seconds &middot; range {min}…{max}
            </Typography>
            <Typography variant="body2">
              Current: <b>{latest !== null ? latest : '—'}</b>
            </Typography>
          </Box>

          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <svg
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              style={{ display: 'block', maxWidth: '100%' }}
            >
              <rect
                x={PADDING_LEFT}
                y={PADDING_TOP}
                width={plotW}
                height={plotH}
                fill="transparent"
                stroke={gridColor}
              />

              {yTicks.map((t, i) => (
                <g key={`y-${i}`}>
                  <line
                    x1={PADDING_LEFT}
                    x2={PADDING_LEFT + plotW}
                    y1={t.y}
                    y2={t.y}
                    stroke={gridColor}
                    strokeDasharray="3 3"
                    opacity={i === 0 || i === 4 ? 0 : 1}
                  />
                  <text
                    x={PADDING_LEFT - 6}
                    y={t.y + 4}
                    textAnchor="end"
                    fontSize={11}
                    fill={axisColor}
                  >
                    {Math.round(t.v)}
                  </text>
                </g>
              ))}

              {xTicks.map((t, i) => (
                <g key={`x-${i}`}>
                  <line
                    x1={t.x}
                    x2={t.x}
                    y1={PADDING_TOP + plotH}
                    y2={PADDING_TOP + plotH + 4}
                    stroke={axisColor}
                  />
                  <text
                    x={t.x}
                    y={PADDING_TOP + plotH + 18}
                    textAnchor="middle"
                    fontSize={11}
                    fill={axisColor}
                  >
                    {t.label}
                  </text>
                </g>
              ))}

              {samples.length > 1 && (
                <>
                  <polygon
                    points={`${PADDING_LEFT},${PADDING_TOP + plotH} ${polyline} ${PADDING_LEFT + plotW},${PADDING_TOP + plotH}`}
                    fill={fillColor}
                    stroke="none"
                  />
                  <polyline
                    points={polyline}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={1.6}
                  />
                </>
              )}

              {samples.length === 0 && (
                <text
                  x={PADDING_LEFT + plotW / 2}
                  y={PADDING_TOP + plotH / 2}
                  textAnchor="middle"
                  fontSize={13}
                  fill={axisColor}
                >
                  Waiting for samples…
                </text>
              )}
            </svg>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeyAnalogChartDialog;
