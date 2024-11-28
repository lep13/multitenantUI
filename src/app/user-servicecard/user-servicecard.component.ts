import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-servicecard',
  standalone: true,
  imports: [],
  templateUrl: './user-servicecard.component.html',
  styleUrl: './user-servicecard.component.scss'
})
export class UserServicecardComponent {

  @Input() serviceName!: string; // Service name to display
  @Input() isSelected: boolean = false; // If the card is selected
  @Output() cardClicked = new EventEmitter<string>(); // Emit when clicked

  onCardClick() {
    this.cardClicked.emit(this.serviceName); // Emit the selected service name
  }

  getServiceLogo(serviceName: string): string {
    // Map service names to logos
    const logoMap: { [key: string]: string } = {
      // AWS Services
      'Amazon EC2 (Elastic Compute Cloud)': 'https://d2q66yyjeovezo.cloudfront.net/icon/d88319dfa5d204f019b4284149886c59-7d586ea82f792b61a8c87de60565133d.svg',
      'Amazon S3 (Simple Storage Service)': 'https://d2q66yyjeovezo.cloudfront.net/icon/c0828e0381730befd1f7a025057c74fb-43acc0496e64afba82dbc9ab774dc622.svg',
      'AWS Lambda': 'https://d2q66yyjeovezo.cloudfront.net/icon/945f3fc449518a73b9f5f32868db466c-926961f91b072604c42b7f39ce2eaf1c.svg',
      'Amazon RDS (Relational Database Service)': 'https://d2q66yyjeovezo.cloudfront.net/icon/1d374ed2a6bcf601d7bfd4fc3dfd3b5d-c9f69416d978016b3191175f35e59226.svg',
      'Amazon DynamoDB': 'https://d2q66yyjeovezo.cloudfront.net/icon/6f419a45e63123b4c16bd679549610f6-87862c68693445999110bbd6a467ce88.svg',
      'AWS CloudFront': 'https://d2q66yyjeovezo.cloudfront.net/icon/4200ac8906c9a841a229ed9e5008a533-465d196059bdeeb0ffcb07ebe5f79b28.svg',
      'Amazon VPC (Virtual Private Cloud)': 'https://d2q66yyjeovezo.cloudfront.net/icon/74f8d03e857091589308684a506ba915-4d9c246d4283a8c3150cf0aa442dec10.svg',
  
      // GCP Services
      'Compute Engine': 'assets/gcp-compute-engine.svg',
      'Cloud Storage': 'assets/gcp-cloud-storage.svg',
      'Google Kubernetes Engine (GKE)': 'assets/gcp-gke.svg',
      'BigQuery': 'assets/gcp-bigquery.svg',
      'Cloud Functions': 'assets/gcp-cloud-functions.svg',
      'Cloud SQL': 'assets/gcp-cloud-sql.svg',
      'Cloud Pub/Sub': 'assets/gcp-cloud-pubsub.svg',
    };
  
    // Return the corresponding logo or a default logo
    return logoMap[serviceName] || 'assets/default-logo.svg';
  }

}
