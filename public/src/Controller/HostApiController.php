<?php

namespace App\Controller;

use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/v1/host', name: 'app_host_api_')]
class HostApiController extends AbstractController
{
    #[Route('/event-info', name: 'eventinfo')]
    public function getEventInfo(
        EventRepository $eventRepository,
    ): JsonResponse
    {
        $event = $eventRepository->findOneBy(['isActive' => true]);

        $json = [
            'event' => [
                'id' => $event->getId(),
                'code' => $event->getCode(),
                'label' => $event->getLabel(),
                'start' => $event->getStartAt()->format('Y-m-d H:i:s'),
            ],
            'room' => [
                'code' => $event->getRoom()->getCode(),
                'label' => $event->getRoom()->getLabel(),
                'rows' => $event->getRoom()->getRows(),
                'columns' => $event->getRoom()->getColumns(),
                'blocked_seats' => $event->getRoom()->getBlockedSeats(),
            ],
            'attendees' => [
                'local' => [],
                'remote' => [],
            ],
        ];

        foreach ($event->getAttendees() as $attendee) {
            if ($attendee->isIsRemote()) {
                $json['attendees']['remote'][] = [
                    'id' => $attendee->getId(),
                    'firstname' => $attendee->getFirstname(),
                    'lastname' => $attendee->getLastname(),
                    'code' => $attendee->getCode(),
                ];
            } else {
                $json['attendees']['local'][$attendee->getSeatRow()][$attendee->getSeatColumn()][] = [
                    'id' => $attendee->getId(),
                    'firstname' => $attendee->getFirstname(),
                    'lastname' => $attendee->getLastname(),
                    'code' => $attendee->getCode(),
                ];
            }
        }

        return $this->json($json);
    }
}
