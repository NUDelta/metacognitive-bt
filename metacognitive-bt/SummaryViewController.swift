//
//  SummaryViewController.swift
//  metacognitive-bt
//
//  Created by Megan C on 2/1/18.
//  Copyright © 2018 DTR. All rights reserved.
//

import UIKit

class SummaryViewController: UIViewController {
    @IBAction func DoneButtonPressed(_ sender: Any) {
        print("yay!!")
        dismiss(animated: true, completion: nil)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
