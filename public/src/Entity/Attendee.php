<?php

namespace App\Entity;

use App\Repository\AttendeeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AttendeeRepository::class)]
class Attendee
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    private ?string $code = null;

    #[ORM\ManyToOne(inversedBy: 'attendees')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Event $event = null;

    #[ORM\Column]
    private ?bool $isRemote = null;

    #[ORM\Column(nullable: true)]
    private ?int $seatRow = null;

    #[ORM\Column(nullable: true)]
    private ?int $seatColumn = null;

    #[ORM\Column(length: 255)]
    private ?string $token = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getEvent(): ?Event
    {
        return $this->event;
    }

    public function setEvent(?Event $event): static
    {
        $this->event = $event;

        return $this;
    }

    public function isIsRemote(): ?bool
    {
        return $this->isRemote;
    }

    public function setIsRemote(bool $isRemote): static
    {
        $this->isRemote = $isRemote;

        return $this;
    }

    public function getSeatRow(): ?int
    {
        return $this->seatRow;
    }

    public function setSeatRow(?int $seatRow): static
    {
        $this->seatRow = $seatRow;

        return $this;
    }

    public function getSeatColumn(): ?int
    {
        return $this->seatColumn;
    }

    public function setSeatColumn(?int $seatColumn): static
    {
        $this->seatColumn = $seatColumn;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): static
    {
        $this->token = $token;

        return $this;
    }
}
