import type { ComponentType } from 'react';
import { Row } from '../components/layout/Row';
import { Column } from '../components/layout/Column';
import { Grid } from '../components/layout/Grid';
import { Image } from '../components/display/Image';
import { Card } from '../components/display/Card';
import { Text } from '../components/display/Text';
import { Button } from '../components/display/Button';
import { Modal } from '../components/overlay/Modal';
import { BottomSheet } from '../components/overlay/BottomSheet';
import type { TimberNodeType } from '../types/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TIMBER_REGISTRY: Record<TimberNodeType, ComponentType<any>> = {
  Row,
  Column,
  Grid,
  Image,
  Card,
  Text,
  Button,
  Modal,
  BottomSheet,
};
